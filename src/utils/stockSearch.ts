export interface StockInfo {
  symbol: string    // e.g. "005930.KS"
  name: string      // e.g. "삼성전자"
  market: 'KOSPI' | 'KOSDAQ'
}

// Built-in popular stocks list (Yahoo Finance symbol format)
export const POPULAR_STOCKS: StockInfo[] = [
  { symbol: '005930.KS', name: '삼성전자', market: 'KOSPI' },
  { symbol: '000660.KS', name: 'SK하이닉스', market: 'KOSPI' },
  { symbol: '035420.KS', name: 'NAVER', market: 'KOSPI' },
  { symbol: '005380.KS', name: '현대차', market: 'KOSPI' },
  { symbol: '035720.KS', name: '카카오', market: 'KOSPI' },
  { symbol: '051910.KS', name: 'LG화학', market: 'KOSPI' },
  { symbol: '068270.KS', name: '셀트리온', market: 'KOSPI' },
  { symbol: '207940.KS', name: '삼성바이오로직스', market: 'KOSPI' },
  { symbol: '006400.KS', name: '삼성SDI', market: 'KOSPI' },
  { symbol: '373220.KS', name: 'LG에너지솔루션', market: 'KOSPI' },
  { symbol: '000270.KS', name: '기아', market: 'KOSPI' },
  { symbol: '096770.KS', name: 'SK이노베이션', market: 'KOSPI' },
  { symbol: '003550.KS', name: 'LG', market: 'KOSPI' },
  { symbol: '055550.KS', name: '신한지주', market: 'KOSPI' },
  { symbol: '105560.KS', name: 'KB금융', market: 'KOSPI' },
  { symbol: '247540.KS', name: '에코프로비엠', market: 'KOSDAQ' },
  { symbol: '086520.KS', name: '에코프로', market: 'KOSDAQ' },
  { symbol: '028300.KS', name: 'HLB', market: 'KOSDAQ' },
]

export function searchStocks(query: string): StockInfo[] {
  if (!query.trim()) return POPULAR_STOCKS.slice(0, 6)
  const q = query.toLowerCase()
  return POPULAR_STOCKS.filter(
    (s) => s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q)
  ).slice(0, 6)
}
