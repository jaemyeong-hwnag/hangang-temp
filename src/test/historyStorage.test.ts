import { describe, it, expect, beforeEach } from 'vitest'
import { saveToHistory, getHistory } from '../utils/historyStorage'

beforeEach(() => localStorage.clear())

describe('getHistory', () => {
  it('저장된 데이터 없으면 빈 배열 반환', () => {
    expect(getHistory()).toEqual([])
  })

  it('잘못된 JSON이면 빈 배열 반환', () => {
    localStorage.setItem('hangang_history', 'not-json')
    expect(getHistory()).toEqual([])
  })

  it('배열이 아닌 JSON이면 빈 배열 반환', () => {
    localStorage.setItem('hangang_history', JSON.stringify({ foo: 'bar' }))
    expect(getHistory()).toEqual([])
  })

  it('저장된 데이터 날짜 오름차순으로 반환', () => {
    localStorage.setItem(
      'hangang_history',
      JSON.stringify([
        { date: '2026-03-20', temp: 10, kospiRate: -2, riskLevel: 'caution' },
        { date: '2026-03-18', temp: 12, kospiRate: 0, riskLevel: 'safe' },
      ]),
    )
    const history = getHistory()
    expect(history[0].date).toBe('2026-03-18')
    expect(history[1].date).toBe('2026-03-20')
  })
})

describe('saveToHistory', () => {
  it('새 항목 저장', () => {
    saveToHistory({ date: '2026-03-20', temp: 10, kospiRate: -2, riskLevel: 'caution' })
    expect(getHistory()).toHaveLength(1)
    expect(getHistory()[0].date).toBe('2026-03-20')
  })

  it('같은 날짜는 덮어쓴다', () => {
    saveToHistory({ date: '2026-03-20', temp: 10, kospiRate: -2, riskLevel: 'caution' })
    saveToHistory({ date: '2026-03-20', temp: 7, kospiRate: -4, riskLevel: 'danger' })
    const history = getHistory()
    expect(history).toHaveLength(1)
    expect(history[0].temp).toBe(7)
    expect(history[0].riskLevel).toBe('danger')
  })

  it('30일 초과 시 오래된 항목 제거', () => {
    for (let i = 1; i <= 31; i++) {
      const day = String(i).padStart(2, '0')
      saveToHistory({ date: `2026-01-${day}`, temp: i, kospiRate: 0, riskLevel: 'normal' })
    }
    const history = getHistory()
    expect(history).toHaveLength(30)
    expect(history[0].date).toBe('2026-01-02') // 가장 오래된 2026-01-01 제거
  })

  it('여러 날짜 저장 시 날짜 오름차순 유지', () => {
    saveToHistory({ date: '2026-03-20', temp: 10, kospiRate: -2, riskLevel: 'caution' })
    saveToHistory({ date: '2026-03-19', temp: 12, kospiRate: 1, riskLevel: 'safe' })
    saveToHistory({ date: '2026-03-21', temp: 8, kospiRate: -5, riskLevel: 'danger' })
    const dates = getHistory().map((e) => e.date)
    expect(dates).toEqual(['2026-03-19', '2026-03-20', '2026-03-21'])
  })
})
