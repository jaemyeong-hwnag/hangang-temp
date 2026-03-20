interface RamenIndexProps {
  score: number
  ramenCount: 0 | 1 | 2 | 3
}

export function RamenIndex({ score, ramenCount }: RamenIndexProps) {
  const clampedScore = Math.max(0, Math.min(100, score))

  return (
    <div className="bg-slate-800 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-300 font-semibold">🍜 라면 지수</span>
        <span className="text-slate-400 text-sm">{Math.round(clampedScore)} / 100</span>
      </div>

      <div className="w-full bg-slate-700 rounded-full h-3 mb-3 overflow-hidden">
        <div
          className="h-3 rounded-full transition-all duration-500"
          style={{
            width: `${clampedScore}%`,
            background:
              clampedScore >= 75
                ? '#ef4444'
                : clampedScore >= 50
                  ? '#f97316'
                  : clampedScore >= 25
                    ? '#eab308'
                    : '#22c55e',
          }}
        />
      </div>

      <div className="text-center">
        {ramenCount === 0 ? (
          <span className="text-slate-400 text-sm">라면 불필요</span>
        ) : (
          <span className="text-2xl">{'🍜'.repeat(ramenCount)}</span>
        )}
        {ramenCount > 0 && (
          <span className="text-slate-400 text-sm ml-2">{ramenCount}개 필요</span>
        )}
      </div>
    </div>
  )
}
