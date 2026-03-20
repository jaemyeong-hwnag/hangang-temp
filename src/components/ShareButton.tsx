import { useState } from 'react'
import type { RiskLevel } from '../utils/riskCalculator'

interface ShareButtonProps {
  level: RiskLevel
  temp: number | null
  kospiRate: number | null
  ramenCount: number
}

const LEVEL_EMOJI: Record<RiskLevel, string> = {
  safe: '🟢 안전',
  normal: '🟡 보통',
  caution: '🟠 주의',
  danger: '🔴 위험',
}

const LEVEL_MESSAGE: Record<RiskLevel, string> = {
  safe: '오늘은 한강 패스. 치킨이나 시키세요.',
  normal: '그럭저럭 버틸만함. 라면 대기 중.',
  caution: '라면이나 한 개 끓여두세요. 대비는 해야죠.',
  danger: '이미 늦었을 수도...',
}

export function ShareButton({ level, temp, kospiRate, ramenCount }: ShareButtonProps) {
  const [toastVisible, setToastVisible] = useState(false)

  function buildShareText(): string {
    const ramenEmoji = ramenCount > 0 ? '🍜'.repeat(ramenCount) : '없음'
    const tempStr = temp != null ? `${temp.toFixed(1)}°C` : '--°C'
    const rateStr = kospiRate != null ? `${kospiRate.toFixed(1)}%` : '--%'
    return [
      `🌡️ 한강온도: ${LEVEL_EMOJI[level]}`,
      `수온 ${tempStr} | 코스피 ${rateStr}`,
      `라면 지수: ${ramenEmoji} (${ramenCount}개)`,
      '',
      LEVEL_MESSAGE[level],
      '→ hangang-temp.vercel.app',
    ].join('\n')
  }

  async function handleShare() {
    const text = buildShareText()

    if (navigator.share !== undefined) {
      try {
        await navigator.share({ text })
        return
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(text)
      setToastVisible(true)
      setTimeout(() => setToastVisible(false), 2000)
    } catch {
      // Clipboard also failed — silently ignore
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => void handleShare()}
        className="w-full bg-slate-700 hover:bg-slate-600 active:bg-slate-800 text-slate-100 font-semibold py-3 px-4 rounded-2xl transition-colors"
      >
        지금 공유하기 📤
      </button>
      {toastVisible && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-600 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap">
          복사됨
        </div>
      )}
    </div>
  )
}
