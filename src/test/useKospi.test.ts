import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useKospi } from '../hooks/useKospi'
import { useAppStore } from '../store/useAppStore'

function makeKospiResponse(price: number, prev: number) {
  return {
    chart: {
      result: [{ meta: { regularMarketPrice: price, chartPreviousClose: prev } }],
    },
  }
}

beforeEach(() => {
  useAppStore.setState({
    temp: null, tempLoading: false, tempError: null,
    kospiRate: null, kospiPrice: null, kospiLoading: false, kospiError: null,
    lastUpdated: null,
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useKospi', () => {
  it('fetch 성공 시 price와 changeRate 저장', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => makeKospiResponse(2500, 2450),
      }),
    )

    const { unmount } = renderHook(() => useKospi())
    await waitFor(() => expect(useAppStore.getState().kospiPrice).not.toBeNull())
    unmount()

    const s = useAppStore.getState()
    expect(s.kospiPrice).toBe(2500)
    expect(s.kospiRate).toBeCloseTo(((2500 - 2450) / 2450) * 100, 5)
    expect(s.kospiLoading).toBe(false)
    expect(s.kospiError).toBeNull()
  })

  it('fetch 실패 시 mock 데이터(2450, -2.5) 사용', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))

    const { unmount } = renderHook(() => useKospi())
    await waitFor(() => expect(useAppStore.getState().kospiPrice).not.toBeNull())
    unmount()

    const s = useAppStore.getState()
    expect(s.kospiPrice).toBe(2450)
    expect(s.kospiRate).toBe(-2.5)
    expect(s.kospiError).not.toBeNull()
    expect(s.kospiLoading).toBe(false)
  })

  it('API ok=false이면 mock 데이터 사용', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 502, json: async () => ({}) }),
    )

    const { unmount } = renderHook(() => useKospi())
    await waitFor(() => expect(useAppStore.getState().kospiPrice).not.toBeNull())
    unmount()

    expect(useAppStore.getState().kospiPrice).toBe(2450)
  })

  it('meta 없으면 mock 데이터 사용', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ chart: { result: [{}] } }),
      }),
    )

    const { unmount } = renderHook(() => useKospi())
    await waitFor(() => expect(useAppStore.getState().kospiPrice).not.toBeNull())
    unmount()

    expect(useAppStore.getState().kospiPrice).toBe(2450)
  })
})
