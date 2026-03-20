interface MetricCardProps {
  label: string
  value: string
  subtitle?: string
  icon: string
  trend?: 'up' | 'down' | 'neutral'
}

function TrendArrow({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
  if (trend === 'up') return <span className="text-green-400 text-sm font-bold">↑</span>
  if (trend === 'down') return <span className="text-red-400 text-sm font-bold">↓</span>
  return <span className="text-slate-400 text-sm">→</span>
}

export function MetricCard({ label, value, subtitle, icon, trend }: MetricCardProps) {
  return (
    <div className="bg-slate-800 rounded-2xl p-4 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-bold text-slate-100 leading-none">{value}</span>
        {trend !== undefined && <TrendArrow trend={trend} />}
      </div>
      {subtitle !== undefined && (
        <p className="text-slate-400 text-xs mt-1">{subtitle}</p>
      )}
    </div>
  )
}
