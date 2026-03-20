import { useState, useEffect } from 'react'

interface StockPrice {
  price: number | null
  changeRate: number | null
  loading: boolean
  error: string | null
}

export function useStockPrice(symbol: string): StockPrice {
  const [state, setState] = useState<StockPrice>({
    price: null,
    changeRate: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    if (!symbol) return
    let cancelled = false

    async function fetchPrice() {
      setState((prev) => ({ ...prev, loading: true, error: null }))
      try {
        const res = await fetch(`/api/stock?symbol=${encodeURIComponent(symbol)}`)
        const data = await res.json() as {
          chart?: {
            result?: Array<{
              meta?: { regularMarketPrice?: number; chartPreviousClose?: number }
            }>
          }
        }
        const meta = data?.chart?.result?.[0]?.meta
        if (!meta || cancelled) return

        const price = meta.regularMarketPrice ?? null
        const prev = meta.chartPreviousClose ?? null
        const changeRate = price != null && prev != null ? ((price - prev) / prev) * 100 : null

        setState({ price, changeRate, loading: false, error: null })
      } catch {
        if (!cancelled) setState((prev) => ({ ...prev, loading: false, error: '데이터 오류' }))
      }
    }

    void fetchPrice()
    return () => { cancelled = true }
  }, [symbol])

  return state
}
