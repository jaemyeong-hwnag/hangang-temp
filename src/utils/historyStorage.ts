export interface HistoryEntry {
  date: string // YYYY-MM-DD
  temp: number
  kospiRate: number
  riskLevel: string
}

const STORAGE_KEY = 'hangang_history'
const MAX_DAYS = 30

export function saveToHistory(entry: HistoryEntry): void {
  const existing = getHistory()
  const filtered = existing.filter((e) => e.date !== entry.date)
  const updated = [...filtered, entry]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-MAX_DAYS)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage may be unavailable in some environments
  }
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return (parsed as HistoryEntry[]).sort((a, b) => a.date.localeCompare(b.date))
  } catch {
    return []
  }
}
