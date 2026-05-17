import OpenAI from 'openai'
import type { LLMAdapter, LLMInput, LLMUsage } from '../llm-adapter'

export class OpenAIAdapter implements LLMAdapter {
  private usage: LLMUsage | null = null

  async *stream(input: LLMInput): AsyncIterable<string> {
    const client = new OpenAI({ apiKey: input.apiKey })
    const stream = await client.chat.completions.create({
      model: input.model,
      messages: [
        { role: 'system', content: input.systemPrompt },
        { role: 'user', content: input.userPrompt },
      ],
      stream: true,
      stream_options: { include_usage: true },
    })

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) yield delta
      if (chunk.usage) {
        this.usage = {
          inputTokens: chunk.usage.prompt_tokens ?? 0,
          outputTokens: chunk.usage.completion_tokens ?? 0,
          model: input.model,
        }
      }
    }
  }

  getUsage() {
    return this.usage
  }
}
