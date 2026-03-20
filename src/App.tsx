import { useState, useEffect } from 'react'
import { useAppStore } from './store/useAppStore'
import { useHangangTemp } from './hooks/useHangangTemp'
import { useKospi } from './hooks/useKospi'
import { calculateRisk } from './utils/riskCalculator'
import { saveToHistory } from './utils/historyStorage'
import { DangerBanner } from './components/DangerBanner'
import { MetricCard } from './components/MetricCard'
import { RamenIndex } from './components/RamenIndex'
import { WeeklyChart } from './components/WeeklyChart'
import { ShareButton } from './components/ShareButton'
import { BottomNav } from './components/BottomNav'
import { AdUnit } from './components/AdUnit'
import { OfflineBanner } from './components/OfflineBanner'
import { NotificationsPage } from './pages/NotificationsPage'
import { SettingsPage } from './pages/SettingsPage'

type Tab = 'home' | 'chart' | 'notifications' | 'settings'

function formatKoreanDate(date: Date): string {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`
}

function toDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default function App() {
  useHangangTemp()
  useKospi()

  const { temp, tempLoading, kospiRate, kospiPrice, kospiLoading } = useAppStore()
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const [historySaved, setHistorySaved] = useState(false)

  const risk =
    temp != null && kospiRate != null
      ? calculateRisk(temp, kospiRate)
      : null

  // Save to history once both data points are available (once per day)
  useEffect(() => {
    if (temp != null && kospiRate != null && risk != null && !historySaved) {
      const today = toDateString(new Date())
      saveToHistory({
        date: today,
        temp,
        kospiRate,
        riskLevel: risk.level,
      })
      setHistorySaved(true)
    }
  }, [temp, kospiRate, risk, historySaved])

  const isLoading = tempLoading && kospiLoading && temp == null && kospiPrice == null

  const tempTrend =
    temp == null ? 'neutral' : temp >= 15 ? 'up' : temp < 10 ? 'down' : 'neutral'
  const kospiTrend =
    kospiRate == null ? 'neutral' : kospiRate > 0 ? 'up' : kospiRate < 0 ? 'down' : 'neutral'

  return (
    <div className="min-h-dvh pb-20">
      <OfflineBanner />

      {activeTab === 'home' && (
        <div className="flex flex-col gap-4 p-4">
          {/* Header */}
          <header className="flex items-center justify-between pt-2">
            <h1 className="text-xl font-bold text-slate-100">한강온도</h1>
            <span className="text-slate-400 text-sm">{formatKoreanDate(new Date())}</span>
          </header>

          {/* Loading skeleton */}
          {isLoading ? (
            <div className="flex flex-col gap-4 animate-pulse">
              <div className="bg-slate-700 rounded-2xl h-24" />
              <div className="bg-slate-700 rounded-2xl h-12" />
              <div className="flex gap-3">
                <div className="bg-slate-700 rounded-2xl h-24 flex-1" />
                <div className="bg-slate-700 rounded-2xl h-24 flex-1" />
              </div>
              <div className="bg-slate-700 rounded-2xl h-20" />
            </div>
          ) : (
            <>
              {/* Danger Banner */}
              <DangerBanner
                level={risk?.level ?? 'normal'}
                temp={temp}
                kospiRate={kospiRate}
              />

              {/* Share Button — directly below banner */}
              <ShareButton
                level={risk?.level ?? 'normal'}
                temp={temp}
                kospiRate={kospiRate}
                ramenCount={risk?.ramenCount ?? 0}
              />

              {/* Ad Unit A — post-result */}
              <AdUnit
                slot={import.meta.env.VITE_ADSENSE_SLOT_A ?? ''}
                format="auto"
              />

              {/* Metric Cards */}
              <div className="flex gap-3">
                <MetricCard
                  label="수온"
                  value={temp != null ? `${temp.toFixed(1)}°C` : '--°C'}
                  subtitle="한강대교 측정소"
                  icon="🌡️"
                  trend={tempTrend}
                />
                <MetricCard
                  label="코스피"
                  value={
                    kospiPrice != null
                      ? kospiPrice.toLocaleString('ko-KR', { maximumFractionDigits: 0 })
                      : '--'
                  }
                  subtitle={
                    kospiRate != null
                      ? `${kospiRate >= 0 ? '+' : ''}${kospiRate.toFixed(2)}%`
                      : undefined
                  }
                  icon="📈"
                  trend={kospiTrend}
                />
              </div>

              {/* Ramen Index */}
              {risk != null && (
                <RamenIndex score={risk.score} ramenCount={risk.ramenCount} />
              )}

              {/* Weekly Chart */}
              <div>
                <h2 className="text-slate-400 text-sm font-semibold mb-2">7일 차트</h2>
                <WeeklyChart />
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'chart' && (
        <div className="flex flex-col gap-4 p-4">
          <header className="flex items-center pt-2">
            <h1 className="text-xl font-bold text-slate-100">차트</h1>
          </header>
          <WeeklyChart />
        </div>
      )}

      {activeTab === 'notifications' && <NotificationsPage />}

      {activeTab === 'settings' && <SettingsPage />}

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  )
}
