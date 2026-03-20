import { useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'

const MOCK_TEMP = 12
const POLL_INTERVAL_MS = 60 * 60 * 1000 // 60 minutes

interface WaterQualityItem {
  wtemp?: string
  waterTemp?: string
  [key: string]: unknown
}

interface WaterQualityResponse {
  response?: {
    body?: {
      items?: {
        item?: WaterQualityItem | WaterQualityItem[]
      }
    }
  }
}

async function fetchHangangTemp(): Promise<number> {
  const apiKey = import.meta.env.VITE_WATER_API_KEY as string | undefined
  if (!apiKey) {
    return MOCK_TEMP
  }

  const params = new URLSearchParams({
    serviceKey: apiKey,
    pageNo: '1',
    numOfRows: '10',
    stationCode: '1018680',
  })

  const url = `http://apis.data.go.kr/B500001/rwis/waterQuality/list?${params.toString()}`

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API responded with status ${res.status}`)
  }

  const data = (await res.json()) as WaterQualityResponse
  const items = data?.response?.body?.items?.item
  const item = Array.isArray(items) ? items[0] : items
  const rawTemp = item?.wtemp ?? item?.waterTemp

  if (rawTemp == null) {
    throw new Error('No temperature value in response')
  }

  const parsed = parseFloat(String(rawTemp))
  if (isNaN(parsed)) {
    throw new Error(`Could not parse temperature: ${String(rawTemp)}`)
  }

  return parsed
}

export function useHangangTemp(): void {
  const { setTemp, setTempLoading, setTempError } = useAppStore()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setTempLoading(true)
      setTempError(null)
      try {
        const temp = await fetchHangangTemp()
        if (!cancelled) {
          setTemp(temp)
          setTempLoading(false)
        }
      } catch {
        if (!cancelled) {
          setTemp(MOCK_TEMP)
          setTempError('수온 데이터를 불러오지 못해 임시값을 사용합니다.')
          setTempLoading(false)
        }
      }
    }

    void load()

    const interval = setInterval(() => {
      void load()
    }, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [setTemp, setTempLoading, setTempError])
}
