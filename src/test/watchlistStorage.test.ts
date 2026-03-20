import { describe, it, expect, beforeEach } from 'vitest'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../utils/watchlistStorage'

const samsung = { symbol: '005930.KS', name: '삼성전자', market: 'KOSPI' as const }
const kakao = { symbol: '035720.KS', name: '카카오', market: 'KOSPI' as const }

beforeEach(() => localStorage.clear())

describe('getWatchlist', () => {
  it('저장된 데이터 없으면 빈 배열 반환', () => {
    expect(getWatchlist()).toEqual([])
  })

  it('잘못된 JSON이면 빈 배열 반환', () => {
    localStorage.setItem('hg_watchlist', 'bad-json')
    expect(getWatchlist()).toEqual([])
  })
})

describe('addToWatchlist', () => {
  it('새 종목 추가', () => {
    addToWatchlist(samsung)
    expect(getWatchlist()).toHaveLength(1)
    expect(getWatchlist()[0].symbol).toBe('005930.KS')
  })

  it('중복 추가 방지 — 같은 심볼은 한 번만 저장', () => {
    addToWatchlist(samsung)
    addToWatchlist(samsung)
    expect(getWatchlist()).toHaveLength(1)
  })

  it('다른 종목은 함께 저장됨', () => {
    addToWatchlist(samsung)
    addToWatchlist(kakao)
    expect(getWatchlist()).toHaveLength(2)
  })
})

describe('removeFromWatchlist', () => {
  it('존재하는 종목 제거', () => {
    addToWatchlist(samsung)
    addToWatchlist(kakao)
    removeFromWatchlist('005930.KS')
    const list = getWatchlist()
    expect(list).toHaveLength(1)
    expect(list[0].symbol).toBe('035720.KS')
  })

  it('존재하지 않는 심볼 제거 시 오류 없음', () => {
    addToWatchlist(samsung)
    expect(() => removeFromWatchlist('없는.KS')).not.toThrow()
    expect(getWatchlist()).toHaveLength(1)
  })

  it('전체 제거 후 빈 배열', () => {
    addToWatchlist(samsung)
    removeFromWatchlist('005930.KS')
    expect(getWatchlist()).toEqual([])
  })
})
