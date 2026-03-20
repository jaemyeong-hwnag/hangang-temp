import { useStockPrice } from '../hooks/useStockPrice'
import { calculateRisk } from '../utils/riskCalculator'
import { removeFromWatchlist } from '../utils/watchlistStorage'
import type { StockInfo } from '../utils/stockSearch'

interface Props {
  stock: StockInfo
  temp: number | null
  onRemove: () => void
}

const LEVEL_STYLES = {
  safe: 'border-green-700 bg-green-950',
  normal: 'border-yellow-700 bg-yellow-950',
  caution: 'border-orange-700 bg-orange-950',
  danger: 'border-red-700 bg-red-950',
}

const LEVEL_EMOJI = { safe: '🟢', normal: '🟡', caution: '🟠', danger: '🔴' }

export function StockRiskCard({ stock, temp, onRemove }: Props) {
  const { price, changeRate, loading } = useStockPrice(stock.symbol)

  const risk =
    temp != null && changeRate != null ? calculateRisk(temp, changeRate) : null

  return (
    <div className={`rounded-2xl border p-4 ${risk ? LEVEL_STYLES[risk.level] : 'border-slate-700 bg-slate-800'}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-slate-200 font-semibold text-sm">{stock.name}</p>
          <p className="text-slate-500 text-xs">{stock.market}</p>
        </div>
        <button
          onClick={() => { removeFromWatchlist(stock.symbol); onRemove() }}
          className="text-slate-600 text-lg leading-none"
          aria-label="관심 종목 제거"
        >
          ×
        </button>
      </div>

      {loading ? (
        <div className="h-10 bg-slate-700 rounded animate-pulse" />
      ) : (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-100 font-bold text-lg">
              {price != null ? price.toLocaleString('ko-KR', { maximumFractionDigits: 0 }) : '--'}
            </p>
            <p className={`text-sm font-medium ${changeRate != null && changeRate < 0 ? 'text-red-400' : 'text-green-400'}`}>
              {changeRate != null ? `${changeRate >= 0 ? '+' : ''}${changeRate.toFixed(2)}%` : '--'}
            </p>
          </div>
          {risk && (
            <div className="text-right">
              <p className="text-2xl">{LEVEL_EMOJI[risk.level]}</p>
              <p className="text-slate-400 text-xs">🍜 {risk.ramenCount}개</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
