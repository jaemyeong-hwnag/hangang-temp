export function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 p-4 pt-6">
      <header>
        <h1 className="text-xl font-bold text-slate-100">설정</h1>
      </header>

      <div className="flex flex-col gap-3">
        <div className="bg-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">앱 정보</p>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-300 text-sm">버전</span>
            <span className="text-slate-500 text-sm">v0.5.0</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-slate-700">
            <span className="text-slate-300 text-sm">슬로건</span>
            <span className="text-slate-500 text-sm">수온이 낮을수록, 주가가 낮을수록</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">데이터 출처</p>
          <div className="flex items-center justify-between py-2">
            <span className="text-slate-300 text-sm">수온</span>
            <span className="text-slate-500 text-sm">한국수자원공사</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-slate-700">
            <span className="text-slate-300 text-sm">코스피</span>
            <span className="text-slate-500 text-sm">Yahoo Finance</span>
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-4">
          <button
            onClick={() => {
              localStorage.clear()
              window.location.reload()
            }}
            className="w-full text-red-400 text-sm font-medium text-center"
          >
            히스토리 데이터 초기화
          </button>
        </div>
      </div>
    </div>
  )
}
