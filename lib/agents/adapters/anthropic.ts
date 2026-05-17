import Anthropic from '@anthropic-ai/sdk'
import type { LLMAdapter, LLMInput, LLMUsage } from '../llm-adapter'

export class AnthropicAdapter implements LLMAdapter {
  private usage: LLMUsage | null = null

  async *stream(input: LLMInput): AsyncIterable<string> {
    const client = new Anthropic({ apiKey: input.apiKey })
    const stream = client.messages.stream({
      model: input.model,
      max_tokens: 4096,
      system: input.systemPrompt,
      messages: [{ role: 'user', content: input.userPrompt }],
    })

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text
      }
    }

    const final = await stream.finalMessage()
    this.usage = {
      inputTokens: final.usage.input_tokens,
      outputTokens: final.usage.output_tokens,
      model: input.model,
    }
  }

  getUsage() {
    return this.usage
  }
}
