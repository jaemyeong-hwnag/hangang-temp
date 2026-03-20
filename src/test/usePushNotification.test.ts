import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { usePushNotification } from '../hooks/usePushNotification'

beforeEach(() => {
  // Reset Notification mock
  Object.defineProperty(globalThis, 'Notification', {
    value: { permission: 'default', requestPermission: vi.fn().mockResolvedValue('granted') },
    writable: true,
    configurable: true,
  })
  Object.defineProperty(navigator, 'serviceWorker', {
    value: { ready: Promise.resolve({ pushManager: { subscribe: vi.fn() } }) },
    writable: true,
    configurable: true,
  })
})

afterEach(() => vi.restoreAllMocks())

describe('usePushNotification', () => {
  it('Notification 지원 시 supported=true', () => {
    const { result } = renderHook(() => usePushNotification())
    expect(result.current.supported).toBe(true)
  })

  it('초기 permission 상태 반영', () => {
    const { result } = renderHook(() => usePushNotification())
    expect(result.current.permission).toBe('default')
  })

  it('subscribe — 권한 요청 후 granted 처리', async () => {
    vi.stubEnv('VITE_VAPID_PUBLIC_KEY', undefined)

    const { result } = renderHook(() => usePushNotification())
    let success = false

    await act(async () => {
      success = await result.current.subscribe()
    })

    // VAPID 키 없으면 subscribe push 단계 실패 → false 반환
    expect(success).toBe(false)
  })

  it('subscribe — 권한 거부 시 false 반환', async () => {
    Object.defineProperty(globalThis, 'Notification', {
      value: { permission: 'default', requestPermission: vi.fn().mockResolvedValue('denied') },
      writable: true,
      configurable: true,
    })

    const { result } = renderHook(() => usePushNotification())
    let success = false

    await act(async () => {
      success = await result.current.subscribe()
    })

    expect(success).toBe(false)
    expect(result.current.permission).toBe('denied')
  })

  it('subscribe — 예외 발생 시 false 반환', async () => {
    ;(globalThis.Notification as { requestPermission: ReturnType<typeof vi.fn> }).requestPermission =
      vi.fn().mockRejectedValue(new Error('permission error'))

    const { result } = renderHook(() => usePushNotification())
    let success = true
    await act(async () => { success = await result.current.subscribe() })
    expect(success).toBe(false)
  })
})
