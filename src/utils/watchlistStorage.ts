import type { StockInfo } from './stockSearch'

const KEY = 'hg_watchlist'

export function getWatchlist(): StockInfo[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as StockInfo[]
  } catch {
    return []
  }
}

export function addToWatchlist(stock: StockInfo): void {
  const list = getWatchlist()
  if (!list.find((s) => s.symbol === stock.symbol)) {
    localStorage.setItem(KEY, JSON.stringify([...list, stock]))
  }
}

export function removeFromWatchlist(symbol: string): void {
  const list = getWatchlist().filter((s) => s.symbol !== symbol)
  localStorage.setItem(KEY, JSON.stringify(list))
}
