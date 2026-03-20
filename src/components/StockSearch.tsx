import { useState } from 'react'
import { searchStocks } from '../utils/stockSearch'
import { addToWatchlist } from '../utils/watchlistStorage'
import type { StockInfo } from '../utils/stockSearch'

interface Props {
  onAdd: () => void
}

export function StockSearch({ onAdd }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const results = searchStocks(query)

  function handleAdd(stock: StockInfo) {
    addToWatchlist(stock)
    setQuery('')
    setOpen(false)
    onAdd()
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="종목 검색 (예: 삼성전자)"
        className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-slate-200 text-sm placeholder-slate-500 outline-none focus:border-slate-400"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-slate-800 border border-slate-600 rounded-xl overflow-hidden shadow-xl">
          {results.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleAdd(stock)}
              className="w-full flex items-center justify-between px-4 py-3 text-left active:bg-slate-700 border-b border-slate-700 last:border-0"
            >
              <span className="text-slate-200 text-sm">{stock.name}</span>
              <span className="text-slate-500 text-xs">{stock.market}</span>
            </button>
          ))}
        </div>
      )}
      {open && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  )
}
