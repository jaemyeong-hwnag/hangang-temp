export type RiskLevel = 'safe' | 'normal' | 'caution' | 'danger'

export interface RiskResult {
  level: RiskLevel
  score: number
  ramenCount: 0 | 1 | 2 | 3
  tempScore: number
  kospiScore: number
}

export function calculateRisk(temp: number, changeRate: number): RiskResult {
  const tempScore = Math.max(0, (20 - temp) * 2.5)
  const kospiScore = Math.max(0, Math.min(50, changeRate * -10))
  const score = tempScore + kospiScore

  let ramenCount: 0 | 1 | 2 | 3
  if (score <= 25) {
    ramenCount = 0
  } else if (score <= 50) {
    ramenCount = 1
  } else if (score <= 75) {
    ramenCount = 2
  } else {
    ramenCount = 3
  }

  let level: RiskLevel
  if (temp >= 15 && changeRate >= 0) {
    level = 'safe'
  } else if (temp < 5 && changeRate < -3) {
    level = 'danger'
  } else if (temp < 10 || changeRate < -1) {
    level = 'caution'
  } else {
    level = 'normal'
  }

  return { level, score, ramenCount, tempScore, kospiScore }
}
