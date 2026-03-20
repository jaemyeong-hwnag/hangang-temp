import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useHangangTemp } from '../hooks/useHangangTemp'
import { useAppStore } from '../store/useAppStore'

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

describe('useHangangTemp', () => {
  it('API 키 없으면 mock 온도 12 사용', async () => {
    const { unmount } = renderHook(() => useHangangTemp())
    await waitFor(() => expect(useAppStore.getState().temp).not.toBeNull())
    unmount()

    expect(useAppStore.getState().temp).toBe(12)
    expect(useAppStore.getState().tempLoading).toBe(false)
  })

  it('fetch 성공 시 수온 파싱 (wtemp)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          response: { body: { items: { item: { wtemp: '9.5' } } } },
        }),
      }),
    )
    vi.stubEnv('VITE_WATER_API_KEY', 'test-key')

    const { unmount } = renderHook(() => useHangangTemp())
    await waitFor(() => expect(useAppStore.getState().temp).not.toBeNull())
    unmount()

    expect(useAppStore.getState().temp).toBe(9.5)
    expect(useAppStore.getState().tempError).toBeNull()
  })

  it('fetch 실패 시 mock 온도 12 사용', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')))
    vi.stubEnv('VITE_WATER_API_KEY', 'test-key')

    const { unmount } = renderHook(() => useHangangTemp())
    await waitFor(() => expect(useAppStore.getState().temp).not.toBeNull())
    unmount()

    expect(useAppStore.getState().temp).toBe(12)
    expect(useAppStore.getState().tempError).not.toBeNull()
  })

  it('item 배열 형태도 파싱 (첫 번째 항목)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          response: { body: { items: { item: [{ wtemp: '14.2' }, { wtemp: '13.8' }] } } },
        }),
      }),
    )
    vi.stubEnv('VITE_WATER_API_KEY', 'test-key')

    const { unmount } = renderHook(() => useHangangTemp())
    await waitFor(() => expect(useAppStore.getState().temp).not.toBeNull())
    unmount()

    expect(useAppStore.getState().temp).toBe(14.2)
  })

  it('API ok=false이면 mock 온도 사용', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) }),
    )
    vi.stubEnv('VITE_WATER_API_KEY', 'test-key')

    const { unmount } = renderHook(() => useHangangTemp())
    await waitFor(() => expect(useAppStore.getState().temp).not.toBeNull())
    unmount()

    expect(useAppStore.getState().temp).toBe(12)
  })
})
