import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../api/client'

/**
 * 舊版是靠後端的 LoginInterceptor 擋 /game.html。
 * 改成 SPA 之後伺服器看不到使用者在哪一頁，所以改成：
 * 進頁面前先問 /api/me，沒登入就導回登入頁。
 * （真正的防線仍在後端 —— 每支 /api/** 都會再驗一次 session）
 */
export default function RequireAuth({ children }) {
  const [status, setStatus] = useState('checking') // checking | ok | denied

  useEffect(() => {
    let cancelled = false
    api
      .me()
      .then(() => !cancelled && setStatus('ok'))
      .catch(() => !cancelled && setStatus('denied'))
    return () => {
      cancelled = true
    }
  }, [])

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-800 text-slate-400">
        載入中…
      </div>
    )
  }
  if (status === 'denied') return <Navigate to="/" replace />
  return children
}
