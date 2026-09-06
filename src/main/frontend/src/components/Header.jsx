export default function Header({ balance, onLogout }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-casino-navy p-4">
      <span className="text-4xl text-casino-gold">⭐ GOLD SLOT ⭐</span>
      <div className="flex items-center gap-2 text-lg">
        <span>💰</span>
        <span>{balance ?? '—'}</span>
        <button
          type="button"
          onClick={onLogout}
          className="ml-2 rounded bg-cyan-600 px-3 py-1 text-white hover:bg-cyan-500"
        >
          登出
        </button>
      </div>
    </header>
  )
}
