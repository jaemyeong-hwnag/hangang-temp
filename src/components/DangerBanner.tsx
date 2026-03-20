import type { RiskLevel } from '../utils/riskCalculator'

interface DangerBannerProps {
  level: RiskLevel
  temp: number | null
  kospiRate: number | null
}

const LEVEL_CONFIG: Record<
  RiskLevel,
  { bg: string; emoji: string; title: string; message: string }
> = {
  safe: {
    bg: 'bg-green-600',
    emoji: '🟢',
    title: '안전',
    message: '오늘은 한강 패스. 치킨이나 시키세요.',
  },
  normal: {
    bg: 'bg-yellow-500',
    emoji: '🟡',
    title: '보통',
    message: '그럭저럭 버틸만함. 라면 대기 중.',
  },
  caution: {
    bg: 'bg-orange-500',
    emoji: '🟠',
    title: '주의',
    message: '라면이나 한 개 끓여두세요. 대비는 해야죠.',
  },
  danger: {
    bg: 'bg-red-600',
    emoji: '🔴',
    title: '위험',
    message: '',
  },
}

export function DangerBanner({ level, temp, kospiRate }: DangerBannerProps) {
  const config = LEVEL_CONFIG[level]

  const message =
    level === 'danger'
      ? `이미 늦었을 수도. 수온 ${temp != null ? temp.toFixed(1) : '--'}°C, 코스피 ${kospiRate != null ? kospiRate.toFixed(1) : '--'}%`
      : config.message

  return (
    <div className={`${config.bg} rounded-2xl p-5 text-white`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-2xl">{config.emoji}</span>
        <span className="text-xl font-bold">{config.title}</span>
      </div>
      <p className="text-base leading-snug">{message}</p>
    </div>
  )
}
