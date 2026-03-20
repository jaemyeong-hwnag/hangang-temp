import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

const MOCK_PRICE = 2450
const MOCK_RATE = -2.5
const MARKET_OPEN_HOUR = 9
const MARKET_CLOSE_HOUR = 15
const MARKET_CLOSE_MINUTE = 30
const POLL_MARKET_HOURS_MS = 15 * 60 * 1000 // 15 minutes
const POLL_OFF_HOURS_MS = 60 * 60 * 1000 // 60 minutes

interface YahooFinanceMeta {
  regularMarketPrice?: number
  chartPreviousClose?: number
}

interface YahooFinanceResult {
  meta?: YahooFinanceMeta
}

interface YahooFinanceChart {
  result?: YahooFinanceResult[]
}

interface YahooFinanceResponse {
  chart?: YahooFinanceChart
}

function isMarketOpen(): boolean {
  const now = new Date()
  // Convert to KST (UTC+9)
  const kstOffset = 9 * 60
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes()
  const kstMinutes = (utcOffset: number) => (utcMinutes + utcOffset) % (24 * 60)
  const totalKstMinutes = kstMinutes(kstOffset)
  const openMinutes = MARKET_OPEN_HOUR * 60
  const closeMinutes = MARKET_CLOSE_HOUR * 60 + MARKET_CLOSE_MINUTE
  return totalKstMinutes >= openMinutes && totalKstMinutes < closeMinutes
}

async function fetchKospi(): Promise<{ price: number; changeRate: number }> {
  const res = await fetch('/api/kospi')
  if (!res.ok) {
    throw new Error(`KOSPI API responded with status ${res.status}`)
  }

  const data = (await res.json()) as YahooFinanceResponse
  const meta = data?.chart?.result?.[0]?.meta

  if (!meta) {
    throw new Error('No meta in KOSPI response')
  }

  const currentPrice = meta.regularMarketPrice
  const previousClose = meta.chartPreviousClose

  if (currentPrice == null || previousClose == null) {
    throw new Error('Missing price data in KOSPI response')
  }

  const changeRate = ((currentPrice - previousClose) / previousClose) * 100
  return { price: currentPrice, changeRate }
}

export function useKospi(): void {
  const { setKospiRate, setKospiPrice, setKospiLoading, setKospiError, setLastUpdated } =
    useAppStore()

  useEffect(() => {
    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null

    async function load() {
      setKospiLoading(true)
      setKospiError(null)
      try {
        const { price, changeRate } = await fetchKospi()
        if (!cancelled) {
          setKospiPrice(price)
          setKospiRate(changeRate)
          setLastUpdated(new Date())
          setKospiLoading(false)
        }
      } catch {
        if (!cancelled) {
          setKospiPrice(MOCK_PRICE)
          setKospiRate(MOCK_RATE)
          setKospiError('코스피 데이터를 불러오지 못해 임시값을 사용합니다.')
          setKospiLoading(false)
        }
      }

      if (!cancelled) {
        const interval = isMarketOpen() ? POLL_MARKET_HOURS_MS : POLL_OFF_HOURS_MS
        timeoutId = setTimeout(() => {
          void load()
        }, interval)
      }
    }

    void load()

    return () => {
      cancelled = true
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [setKospiRate, setKospiPrice, setKospiLoading, setKospiError, setLastUpdated])
}
