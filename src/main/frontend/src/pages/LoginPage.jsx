import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function LoginPage() {
  // 帳號輸入框的值（受控元件：畫面上顯示什麼完全由這個 state 決定）
  const [username, setUsername] = useState('')
  // 密碼輸入框的值，同樣是受控元件
  const [password, setPassword] = useState('')
  // 紅色錯誤訊息，內容是後端回的原因（帳號密碼錯誤、帳號已停用…）
  const [errorMsg, setErrorMsg] = useState('')
  // 綠色成功訊息，目前只有註冊成功會用到
  const [infoMsg, setInfoMsg] = useState('')
  // 送出中；登入與註冊按鈕會被 disable，避免使用者連點送出兩次
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  function clearMessages() {
    setErrorMsg('')
    setInfoMsg('')
  }

  // 表單 onSubmit 只負責登入，這樣在密碼欄按 Enter 也能送出（跟舊版行為一致）
  async function handleLogin(event) {
    event.preventDefault()
    clearMessages()
    setBusy(true)
    try {
      await api.login(username, password)
      navigate('/game', { replace: true })
    } catch (error) {
      // 後端會回「帳號或密碼錯誤」「帳號已經停用」等具體訊息
      setErrorMsg(error.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleRegister() {
    clearMessages()
    setBusy(true)
    try {
      await api.register(username, password)
      setInfoMsg('註冊帳號成功，請直接登入')
    } catch (error) {
      setErrorMsg(error.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-800 text-slate-100">
      <main className="w-full max-w-[400px] border-[3px] border-amber-400 bg-casino-navy p-12 shadow-[0_0_20px_rgba(240,200,82,0.9)]">
        <div className="mb-6 text-center text-2xl">⭐ GOLD SLOT ⭐</div>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="mb-1 block">帳號</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 focus:border-amber-400 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="mb-1 block">密碼</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2 focus:border-amber-400 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <div role="alert" className="mb-4 rounded bg-red-900/60 px-3 py-2 text-red-200">
              {errorMsg}
            </div>
          )}
          {infoMsg && (
            <div role="status" className="mb-4 rounded bg-green-900/60 px-3 py-2 text-green-200">
              {infoMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mb-3 w-full rounded bg-amber-400 py-2 text-lg font-medium text-slate-900 hover:bg-amber-300 disabled:opacity-50"
          >
            登入
          </button>
          <button
            type="button"
            onClick={handleRegister}
            disabled={busy}
            className="w-full rounded bg-amber-400 py-2 text-lg font-medium text-slate-900 hover:bg-amber-300 disabled:opacity-50"
          >
            註冊
          </button>
        </form>
      </main>
    </div>
  )
}
