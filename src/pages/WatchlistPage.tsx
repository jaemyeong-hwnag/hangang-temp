import { useState } from 'react'
import { StockSearch } from '../components/StockSearch'
import { StockRiskCard } from '../components/StockRiskCard'
import { getWatchlist } from '../utils/watchlistStorage'
import { useAppStore } from '../store/useAppStore'

export function WatchlistPage() {
  const { temp } = useAppStore()
  const [watchlist, setWatchlist] = useState(() => getWatchlist())

  function refresh() {
    setWatchlist(getWatchlist())
  }

  return (
    <div className="flex flex-col gap-4 p-4 pt-6">
      <header>
        <h1 className="text-xl font-bold text-slate-100">내 종목</h1>
        <p className="text-slate-500 text-xs mt-1">종목별 한강행 위험도</p>
      </header>

      <StockSearch onAdd={refresh} />

      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-slate-400 text-sm">관심 종목을 추가해보세요</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {watchlist.map((stock) => (
            <StockRiskCard
              key={stock.symbol}
              stock={stock}
              temp={temp}
              onRemove={refresh}
            />
          ))}
        </div>
      )}
    </div>
  )
}
