import { createClient } from '@/lib/supabase/server'
import { createAdapter } from '@/lib/agents/factory'
import { buildSystemPrompt } from '@/lib/agents/system-prompt'
import { pickAdapter } from '@/lib/agents/llm-adapter'
import { calcCost } from '@/lib/pricing/models'
import { MSG } from '@/lib/i18n/messages'

export const runtime = 'nodejs'
export const maxDuration = 60

interface RequestBody {
  agentId: string
  prompt: string
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response(JSON.stringify({ error: MSG.errors.auth }), { status: 401 })
  }

  const body = (await request.json()) as RequestBody
  const { agentId, prompt } = body
  if (!agentId || !prompt?.trim()) {
    return new Response(JSON.stringify({ error: 'agentId와 prompt는 필수입니다' }), { status: 400 })
  }

  // 프롬프트 길이 제한 (10,000자)
  const MAX_PROMPT_LENGTH = 10_000
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return new Response(
      JSON.stringify({ error: `프롬프트는 ${MAX_PROMPT_LENGTH.toLocaleString()}자 이하로 입력해주세요` }),
      { status: 400 }
    )
  }

  // 에이전트 + 회사 조회
  const { data: agent } = await supabase
    .from('agents')
    .select('*, company:companies(*)')
    .eq('id', agentId)
    .single()

  if (!agent) {
    return new Response(JSON.stringify({ error: MSG.errors.notFound }), { status: 404 })
  }
  if (!agent.is_hired) {
    return new Response(JSON.stringify({ error: '먼저 에이전트를 고용해주세요' }), { status: 400 })
  }

  // 사용자 API 키 조회
  const { data: profile } = await supabase
    .from('users')
    .select('openai_key, anthropic_key')
    .eq('id', user.id)
    .single()

  const kind = pickAdapter(agent.recommended_model)
  const apiKey = kind === 'openai' ? profile?.openai_key : profile?.anthropic_key
  if (!apiKey) {
    return new Response(JSON.stringify({ error: MSG.errors.apiKeyMissing }), { status: 400 })
  }

  // task row 생성
  const { data: task, error: taskErr } = await supabase
    .from('tasks')
    .insert({
      agent_id: agentId,
      user_id: user.id,
      prompt,
      model: agent.recommended_model,
      status: 'streaming',
    })
    .select()
    .single()

  if (taskErr || !task) {
    return new Response(JSON.stringify({ error: taskErr?.message ?? MSG.errors.unknown }), { status: 500 })
  }

  const adapter = createAdapter(agent.recommended_model)
  const systemPrompt = buildSystemPrompt(agent.company, agent.name, agent.role)

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      let full = ''
      try {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'task', taskId: task.id })}\n\n`))

        for await (const chunk of adapter.stream({
          systemPrompt,
          userPrompt: prompt,
          model: agent.recommended_model,
          apiKey,
        })) {
          full += chunk
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'delta', delta: chunk })}\n\n`))
        }

        const usage = adapter.getUsage()
        const cost = usage
          ? calcCost(usage.model, usage.inputTokens, usage.outputTokens)
          : { usd: 0, krw: 0 }

        await supabase
          .from('tasks')
          .update({
            response: full,
            status: 'completed',
            completed_at: new Date().toISOString(),
          })
          .eq('id', task.id)

        if (usage) {
          await supabase.from('usage_logs').insert({
            user_id: user.id,
            task_id: task.id,
            model: usage.model,
            input_tokens: usage.inputTokens,
            output_tokens: usage.outputTokens,
            cost_usd: cost.usd,
            cost_krw: cost.krw,
          })
        }

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'done', usage, cost })}\n\n`)
        )
      } catch (err) {
        const message = err instanceof Error ? err.message : MSG.errors.unknown
        await supabase
          .from('tasks')
          .update({ status: 'failed', error_message: message })
          .eq('id', task.id)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'error', error: message })}\n\n`)
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
