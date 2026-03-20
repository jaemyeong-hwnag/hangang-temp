import { usePushNotification } from '../hooks/usePushNotification'

export function NotificationsPage() {
  const { permission, supported, subscribe } = usePushNotification()

  return (
    <div className="flex flex-col gap-6 p-4 pt-6">
      <header>
        <h1 className="text-xl font-bold text-slate-100">알림 설정</h1>
      </header>

      {!supported ? (
        <div className="bg-slate-800 rounded-2xl p-4 text-slate-400 text-sm">
          이 브라우저는 푸시 알림을 지원하지 않아요.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="bg-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-slate-200 text-sm font-medium">코스피 급락 알림</p>
              <p className="text-slate-500 text-xs mt-1">코스피 -3% 이하 시 알림</p>
            </div>
            <button
              onClick={subscribe}
              disabled={permission === 'granted'}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                permission === 'granted'
                  ? 'bg-green-800 text-green-300'
                  : 'bg-blue-600 text-white active:bg-blue-700'
              }`}
            >
              {permission === 'granted' ? '활성화됨' : '허용'}
            </button>
          </div>

          <div className="bg-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-slate-200 text-sm font-medium">수온 경보</p>
              <p className="text-slate-500 text-xs mt-1">수온 10°C 이하 시 알림</p>
            </div>
            <button
              onClick={subscribe}
              disabled={permission === 'granted'}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                permission === 'granted'
                  ? 'bg-green-800 text-green-300'
                  : 'bg-blue-600 text-white active:bg-blue-700'
              }`}
            >
              {permission === 'granted' ? '활성화됨' : '허용'}
            </button>
          </div>

          <div className="bg-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-slate-200 text-sm font-medium">모닝 브리핑</p>
              <p className="text-slate-500 text-xs mt-1">오전 9시 한강행 위험도 요약</p>
            </div>
            <button
              onClick={subscribe}
              disabled={permission === 'granted'}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                permission === 'granted'
                  ? 'bg-green-800 text-green-300'
                  : 'bg-blue-600 text-white active:bg-blue-700'
              }`}
            >
              {permission === 'granted' ? '활성화됨' : '허용'}
            </button>
          </div>

          {permission === 'denied' && (
            <p className="text-red-400 text-xs text-center">
              알림이 차단됐어요. 브라우저 설정에서 허용해 주세요.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
