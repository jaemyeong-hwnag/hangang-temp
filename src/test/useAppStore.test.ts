import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../store/useAppStore'

beforeEach(() => {
  useAppStore.setState({
    temp: null, tempLoading: false, tempError: null,
    kospiRate: null, kospiPrice: null, kospiLoading: false, kospiError: null,
    lastUpdated: null,
  })
})

describe('useAppStore', () => {
  it('초기 상태 확인', () => {
    const s = useAppStore.getState()
    expect(s.temp).toBeNull()
    expect(s.kospiRate).toBeNull()
    expect(s.tempLoading).toBe(false)
    expect(s.kospiLoading).toBe(false)
  })

  it('setTemp — 수온 업데이트', () => {
    useAppStore.getState().setTemp(12.5)
    expect(useAppStore.getState().temp).toBe(12.5)
  })

  it('setTemp — null 허용', () => {
    useAppStore.getState().setTemp(10)
    useAppStore.getState().setTemp(null)
    expect(useAppStore.getState().temp).toBeNull()
  })

  it('setTempLoading', () => {
    useAppStore.getState().setTempLoading(true)
    expect(useAppStore.getState().tempLoading).toBe(true)
    useAppStore.getState().setTempLoading(false)
    expect(useAppStore.getState().tempLoading).toBe(false)
  })

  it('setTempError', () => {
    useAppStore.getState().setTempError('API 오류')
    expect(useAppStore.getState().tempError).toBe('API 오류')
    useAppStore.getState().setTempError(null)
    expect(useAppStore.getState().tempError).toBeNull()
  })

  it('setKospiRate + setKospiPrice', () => {
    useAppStore.getState().setKospiRate(-3.5)
    useAppStore.getState().setKospiPrice(2350)
    const s = useAppStore.getState()
    expect(s.kospiRate).toBe(-3.5)
    expect(s.kospiPrice).toBe(2350)
  })

  it('setKospiLoading + setKospiError', () => {
    useAppStore.getState().setKospiLoading(true)
    useAppStore.getState().setKospiError('연결 실패')
    const s = useAppStore.getState()
    expect(s.kospiLoading).toBe(true)
    expect(s.kospiError).toBe('연결 실패')
  })

  it('setLastUpdated', () => {
    const now = new Date()
    useAppStore.getState().setLastUpdated(now)
    expect(useAppStore.getState().lastUpdated).toBe(now)
  })
})
