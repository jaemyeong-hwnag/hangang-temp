import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useStockPrice } from '../hooks/useStockPrice'

afterEach(() => vi.restoreAllMocks())

function makeResponse(price: number, prev: number) {
  return {
    chart: { result: [{ meta: { regularMarketPrice: price, chartPreviousClose: prev } }] },
  }
}

describe('useStockPrice', () => {
  it('초기 상태: loading=true, price=null', () => {
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {}))) // never resolves
    const { result } = renderHook(() => useStockPrice('005930.KS'))
    expect(result.current.loading).toBe(true)
    expect(result.current.price).toBeNull()
  })

  it('symbol 없으면 fetch 미호출, loading=true 유지', () => {
    const mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
    renderHook(() => useStockPrice(''))
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('fetch 성공 시 price, changeRate 반환', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: async () => makeResponse(75000, 70000) }),
    )

    const { result } = renderHook(() => useStockPrice('005930.KS'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.price).toBe(75000)
    expect(result.current.changeRate).toBeCloseTo(((75000 - 70000) / 70000) * 100, 5)
    expect(result.current.error).toBeNull()
  })

  it('fetch 실패 시 error 설정', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))

    const { result } = renderHook(() => useStockPrice('005930.KS'))
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.error).toBe('데이터 오류')
    expect(result.current.price).toBeNull()
  })

  it('meta 없으면 price=null 유지', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: async () => ({ chart: { result: [{}] } }) }),
    )

    const { result } = renderHook(() => useStockPrice('005930.KS'))
    // meta 없으면 setState 미호출 → loading true 유지
    await new Promise((r) => setTimeout(r, 50))
    expect(result.current.price).toBeNull()
  })
})
