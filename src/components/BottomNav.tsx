type Tab = 'home' | 'watchlist' | 'chart' | 'settings'

interface BottomNavProps {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'home', label: '홈', emoji: '🏠' },
  { id: 'watchlist', label: '종목', emoji: '📋' },
  { id: 'chart', label: '차트', emoji: '📊' },
  { id: 'settings', label: '설정', emoji: '⚙️' },
]

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-slate-900 border-t border-slate-800 z-50">
      <div className="flex">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition-colors ${
              active === tab.id ? 'text-blue-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <span className="text-xl">{tab.emoji}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
