export const MODEL_PRICING_USD: Record<string, { input: number; output: number }> = {
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'claude-sonnet-4-20250514': { input: 3.00, output: 15.00 },
  'claude-3-5-haiku-latest': { input: 0.25, output: 1.25 },
}

export const DEFAULT_USD_TO_KRW = Number(process.env.NEXT_PUBLIC_USD_TO_KRW ?? 1350)

export function calcCost(
  model: string,
  inputTokens: number,
  outputTokens: number,
  usdToKrw: number = DEFAULT_USD_TO_KRW
): { usd: number; krw: number } {
  const price = MODEL_PRICING_USD[model]
  if (!price) return { usd: 0, krw: 0 }
  const usd = (inputTokens / 1_000_000) * price.input + (outputTokens / 1_000_000) * price.output
  const krw = usd * usdToKrw
  return { usd: Number(usd.toFixed(6)), krw: Number(krw.toFixed(2)) }
}
