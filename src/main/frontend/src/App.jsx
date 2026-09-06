import { Navigate, Route, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import GamePage from './pages/GamePage'
import LoginPage from './pages/LoginPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/game"
        element={
          <RequireAuth>
            <GamePage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
