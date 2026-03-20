import { describe, it, expect } from 'vitest'
import { calculateRisk } from '../utils/riskCalculator'

describe('calculateRisk', () => {
  // ─── 위험도 판정 ───────────────────────────────────────────────
  describe('level', () => {
    it('safe: 수온 ≥ 15 AND 변동률 ≥ 0', () => {
      expect(calculateRisk(15, 0).level).toBe('safe')
      expect(calculateRisk(20, 2).level).toBe('safe')
      expect(calculateRisk(15, 0).level).toBe('safe')
    })

    it('safe: 경계값 수온 정확히 15, 변동률 0', () => {
      expect(calculateRisk(15, 0).level).toBe('safe')
    })

    it('danger: 수온 < 5 AND 변동률 < -3', () => {
      expect(calculateRisk(4.9, -3.1).level).toBe('danger')
      expect(calculateRisk(0, -10).level).toBe('danger')
    })

    it('danger 아님: 수온 < 5이지만 변동률 ≥ -3', () => {
      expect(calculateRisk(4, -3).level).not.toBe('danger')
    })

    it('danger 아님: 변동률 < -3이지만 수온 ≥ 5', () => {
      expect(calculateRisk(5, -4).level).not.toBe('danger')
    })

    it('caution: 수온 < 10', () => {
      expect(calculateRisk(9.9, 0).level).toBe('caution')
    })

    it('caution: 변동률 < -1', () => {
      expect(calculateRisk(12, -1.1).level).toBe('caution')
    })

    it('normal: 그 외', () => {
      expect(calculateRisk(10, -0.5).level).toBe('normal')
      expect(calculateRisk(14, -1).level).toBe('normal')
    })
  })

  // ─── 점수 계산 ────────────────────────────────────────────────
  describe('score calculation', () => {
    it('수온 점수: max(0, (20 - temp) * 2.5)', () => {
      expect(calculateRisk(20, 0).tempScore).toBe(0)
      expect(calculateRisk(10, 0).tempScore).toBe(25)
      expect(calculateRisk(0, 0).tempScore).toBe(50)
      expect(calculateRisk(25, 0).tempScore).toBe(0) // 음수 불가
    })

    it('코스피 점수: max(0, min(50, rate * -10))', () => {
      expect(calculateRisk(20, 0).kospiScore).toBe(0)
      expect(calculateRisk(20, -1).kospiScore).toBe(10)
      expect(calculateRisk(20, -5).kospiScore).toBe(50)
      expect(calculateRisk(20, -10).kospiScore).toBe(50) // 50 상한
      expect(calculateRisk(20, 2).kospiScore).toBe(0)   // 상승 시 0
    })

    it('총 점수 = 수온점수 + 코스피점수', () => {
      const r = calculateRisk(10, -1)
      expect(r.score).toBe(r.tempScore + r.kospiScore)
    })
  })

  // ─── 라면 지수 ────────────────────────────────────────────────
  describe('ramenCount', () => {
    it('score 0~25 → 0개', () => {
      expect(calculateRisk(20, 0).ramenCount).toBe(0)
    })

    it('score 26~50 → 1개', () => {
      // 수온 10 → 점수 25, 변동률 -0.2 → 점수 2 = 27
      expect(calculateRisk(10, -0.2).ramenCount).toBe(1)
    })

    it('score 51~75 → 2개', () => {
      // 수온 5 → 점수 37.5, 변동률 -2 → 점수 20 = 57.5
      expect(calculateRisk(5, -2).ramenCount).toBe(2)
    })

    it('score 76~100 → 3개', () => {
      // 수온 0 → 점수 50, 변동률 -5 → 점수 50 = 100
      expect(calculateRisk(0, -5).ramenCount).toBe(3)
    })

    it('경계값 score 25 → 0개', () => {
      // 수온 10 → 25, rate 0 → 0 = 25
      expect(calculateRisk(10, 0).ramenCount).toBe(0)
    })

    it('경계값 score 50 → 1개', () => {
      // 수온 0 → 50, rate 0 → 0 = 50
      expect(calculateRisk(0, 0).ramenCount).toBe(1)
    })
  })
})
