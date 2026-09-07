import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../api/client'
import { SessionContext } from '../context/session'

/**
 * 舊版是靠後端的 LoginInterceptor 擋 /game.html。
 * 改成 SPA 之後伺服器看不到使用者在哪一頁，所以改成：
 * 進頁面前先問 /api/me，沒登入就導回登入頁。
 * （真正的防線仍在後端 —— 每支 /api/** 都會再驗一次 session）
 *
 * /api/me 會連餘額一起回來，透過 Context 交給 GamePage 當初始值，
 * 這樣進遊戲頁只要一次請求就夠了。
 */
export default function RequireAuth({ children }) {
  // status：checking = 還在問、ok = 已登入、denied = 沒登入
  // session：/api/me 的回應（memberID 與 balance），只有 ok 時有值
  const [auth, setAuth] = useState({ status: 'checking', session: null })

  useEffect(() => {
    let cancelled = false
    api
      .me()
      .then((data) => !cancelled && setAuth({ status: 'ok', session: data }))
      .catch(() => !cancelled && setAuth({ status: 'denied', session: null }))
    return () => {
      cancelled = true
    }
  }, [])

  if (auth.status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-800 text-slate-400">
        載入中…
      </div>
    )
  }
  if (auth.status === 'denied') return <Navigate to="/" replace />
  return <SessionContext value={auth.session}>{children}</SessionContext>
}
