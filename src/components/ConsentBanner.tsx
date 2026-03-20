import { useState, useEffect } from 'react'

const KEY = 'hg_consent'

export function ConsentBanner() {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem(KEY)) setShown(true)
  }, [])

  if (!shown) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 max-w-[430px] mx-auto px-4">
      <div className="bg-slate-800 border border-slate-600 rounded-2xl p-4 shadow-2xl">
        <p className="text-slate-300 text-xs leading-relaxed mb-3">
          이 사이트는 광고 서비스를 위해 쿠키를 사용합니다.
          계속 이용하시면 쿠키 사용에 동의하는 것으로 간주됩니다.
        </p>
        <button
          onClick={() => { localStorage.setItem(KEY, '1'); setShown(false) }}
          className="w-full bg-slate-600 text-slate-200 text-xs font-semibold py-2 rounded-lg active:bg-slate-500"
        >
          확인
        </button>
      </div>
    </div>
  )
}
