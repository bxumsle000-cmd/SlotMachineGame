import { createContext, useContext } from 'react'

/**
 * RequireAuth 問 /api/me 時後端會連餘額一起回，這裡把那份結果放進 Context，
 * 讓 GamePage 直接拿來當初始值，不必再打一次 /api/balance。
 */
export const SessionContext = createContext(null)

export function useSession() {
  return useContext(SessionContext)
}
