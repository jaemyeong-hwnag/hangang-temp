import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show after 30 seconds of usage
      setTimeout(() => setShown(true), 30000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!shown || !deferredPrompt) return null

  async function handleInstall() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setShown(false)
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 max-w-[430px] mx-auto px-4">
      <div className="bg-slate-800 border border-blue-700 rounded-2xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-slate-200 text-sm font-semibold">홈 화면에 추가하기</p>
          <button onClick={() => setShown(false)} className="text-slate-500 text-lg">×</button>
        </div>
        <p className="text-slate-400 text-xs mb-3">
          한강온도를 앱처럼 사용하세요. 빠른 접근 + 푸시 알림
        </p>
        <button
          onClick={() => void handleInstall()}
          className="w-full bg-blue-600 text-white text-sm font-semibold py-2.5 rounded-xl active:bg-blue-700"
        >
          설치하기
        </button>
      </div>
    </div>
  )
}
