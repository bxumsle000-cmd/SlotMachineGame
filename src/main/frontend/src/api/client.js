/**
 * 後端的錯誤格式是固定的：HTTP 狀態碼 + { "message": "..." }
 * （見 GlobalExceptionHandler），所以這裡統一把它轉成 ApiError 丟出來，
 * 元件只要 try/catch 就能拿到後端寫好的中文訊息。
 */
export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(url, options = {}) {
  const res = await fetch(url, { credentials: 'include', ...options })

  if (!res.ok) {
    let message = `發生錯誤（HTTP ${res.status}）`
    try {
      const body = await res.json()
      if (body && body.message) {
        message = body.message }
    } catch {
      // 後端沒回 JSON（例如 500 的 HTML 錯誤頁）就用上面的預設訊息
    }
    throw new ApiError(res.status, message)
  }

  // /api/login、/api/logout 回傳 void（空 body），不能直接 res.json() 會爆
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

function postJson(url, payload) {
  return request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export const api = {
  me: () => request('/api/me'),
  login: (username, password) => postJson('/api/login', { username, password }),
  register: (username, password) => postJson('/api/register', { username, password }),
  logout: () => request('/api/logout', { method: 'POST' }),
  balance: () => request('/api/balance'),
  spin: (betAmount) => request(`/api/spin?betAmount=${betAmount}`, { method: 'POST' }),
  paytable: () => request('/api/paytable'),
}
