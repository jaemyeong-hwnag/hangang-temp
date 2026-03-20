import { describe, it, expect } from 'vitest'
import { searchStocks, POPULAR_STOCKS } from '../utils/stockSearch'

describe('searchStocks', () => {
  it('빈 쿼리는 인기 종목 6개 반환', () => {
    const result = searchStocks('')
    expect(result).toHaveLength(6)
    expect(result).toEqual(POPULAR_STOCKS.slice(0, 6))
  })

  it('공백만 있는 쿼리는 인기 종목 6개 반환', () => {
    expect(searchStocks('   ')).toHaveLength(6)
  })

  it('한글 이름으로 검색', () => {
    const result = searchStocks('삼성전자')
    expect(result.some((s) => s.name === '삼성전자')).toBe(true)
  })

  it('심볼로 검색', () => {
    const result = searchStocks('005930')
    expect(result.some((s) => s.symbol === '005930.KS')).toBe(true)
  })

  it('대소문자 무관 검색', () => {
    const result = searchStocks('naver')
    expect(result.some((s) => s.name === 'NAVER')).toBe(true)
  })

  it('매칭 없으면 빈 배열 반환', () => {
    expect(searchStocks('존재하지않는종목xyz')).toEqual([])
  })

  it('결과 최대 6개로 제한', () => {
    // 'KS'는 대부분 종목의 심볼에 포함됨
    const result = searchStocks('KS')
    expect(result.length).toBeLessThanOrEqual(6)
  })

  it('KOSDAQ 종목도 검색됨', () => {
    const result = searchStocks('에코프로')
    expect(result.some((s) => s.market === 'KOSDAQ')).toBe(true)
  })
})
