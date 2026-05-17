import { OpenAIAdapter } from './adapters/openai'
import { AnthropicAdapter } from './adapters/anthropic'
import { pickAdapter, type LLMAdapter } from './llm-adapter'

export function createAdapter(model: string): LLMAdapter {
  const kind = pickAdapter(model)
  if (kind === 'openai') return new OpenAIAdapter()
  return new AnthropicAdapter()
}
