export interface LLMInput {
  systemPrompt: string
  userPrompt: string
  model: string
  apiKey: string
}

export interface LLMUsage {
  inputTokens: number
  outputTokens: number
  model: string
}

export interface LLMAdapter {
  stream(input: LLMInput): AsyncIterable<string>
  getUsage(): LLMUsage | null
}

export type AdapterKind = 'openai' | 'anthropic'

export function pickAdapter(model: string): AdapterKind {
  if (model.startsWith('gpt-')) return 'openai'
  if (model.startsWith('claude-')) return 'anthropic'
  throw new Error(`지원하지 않는 모델: ${model}`)
}
