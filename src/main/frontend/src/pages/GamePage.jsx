import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import {
  BASE_DURATION,
  BET_STEP,
  MAX_BET,
  MIN_BET,
  PAYLINE_COUNT,
  REEL_COUNT,
  ROW_COUNT,
  STAGGER,
  SYMBOL_ICONS,
} from '../constants/game'
import { useSession } from '../context/session'
import BetControl from '../components/BetControl'
import Header from '../components/Header'
import PaytableDialog from '../components/PaytableDialog'
import ReelWindow from '../components/ReelWindow'
import SpinButton from '../components/SpinButton'

// 還沒轉過時的空盤面。有了它，reelSymbols 就永遠不必處理 null。
const BLANK_GRID = Array.from({ length: ROW_COUNT }, () => Array(REEL_COUNT).fill('Blank'))

// 五軸同時開始轉，最右邊那軸停得最晚；等它停完就等於全部停妥。
const SPIN_MS = (BASE_DURATION + STAGGER * (REEL_COUNT - 1)) * 1000

// 後端的 grid 是 grid[列][欄]，但每個轉軸要的是「同一欄的 3 個符號」，
// 所以這裡把它轉置一下。
function reelSymbols(grid, col) {
  return grid.map((row) => row[col])
}

export default function GamePage() {
  // RequireAuth 問 /api/me 時已經把餘額一起帶回來了，直接拿來當初始值
  const session = useSession()

  const [balance, setBalance] = useState(session.balance)
  const [betAmount, setBetAmount] = useState(MIN_BET)
  const [winScore, setWinScore] = useState(0)
  const [resultText, setResultText] = useState('準備好就spin!')
  const [grid, setGrid] = useState(BLANK_GRID)
  // 轉動流水號，每按一次 Spin 就 +1；傳給 ReelWindow 當作「開始轉」的訊號
  const [spinNo, setSpinNo] = useState(0)
  // 是否正在轉動中；用來 disable Spin 與下注按鈕，避免重複送出請求
  const [spinning, setSpinning] = useState(false)
  // 賠付表對話框是開著還是關著
  const [paytableOpen, setPaytableOpen] = useState(false)
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await api.logout()
    } finally {
      navigate('/', { replace: true })
    }
  }

  function handleIncreaseBet() {
    // 按 + 加 50，超過上限就繞回最低額（跟後端 BetConfig 一致）
    setBetAmount((current) => (current < MAX_BET ? current + BET_STEP : MIN_BET))
  }

  async function handleSpin() {
    if (balance < betAmount) {
      setResultText('餘額不足')
      return
    }

    setSpinning(true)

    try {
      const data = await api.spin(betAmount)

      // 先扣掉注金，讓餘額在轉動期間就反映出來
      setBalance((current) => current - betAmount)

      setGrid(data.grid)
      setSpinNo((n) => n + 1)
      // 轉軸動畫要跑多久是前端自己算的，所以等同樣長的時間就等於等它們停妥
      await new Promise((resolve) => setTimeout(resolve, SPIN_MS))

      setWinScore(data.winAmount)
      // 結算餘額直接用後端算好的，前端不重複實作一次規則
      setBalance(data.balance)

      if (data.winAmount > 0) {
        const lines = data.winPayable.map(
          ({ symbol, count, multiplier }) =>
            `${SYMBOL_ICONS[symbol]}    ${count}連線  ${multiplier / PAYLINE_COUNT}X`,
        )
        setResultText(lines.join('\n'))
      } else {
        setResultText('再接再厲')
      }
    } catch (error) {
      // 會拋錯的只有 api.spin()，那時還沒扣注金，所以餘額不需要還原
      setResultText(error.message)
      if (error.status === 401) navigate('/', { replace: true })
    } finally {
      setSpinning(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-800 pb-20 text-slate-100">
      <Header balance={balance} onLogout={handleLogout} />

      <main className="mx-auto my-12 flex max-w-[720px] justify-center gap-4 border-[3px] border-amber-400 p-12 shadow-[0_0_20px_rgba(240,200,82,0.9)]">
        {Array.from({ length: REEL_COUNT }, (_, col) => (
          <ReelWindow
            key={col}
            symbols={reelSymbols(grid, col)}
            spinNo={spinNo}
            duration={BASE_DURATION + STAGGER * col}
          />
        ))}
      </main>

      <div className="flex justify-center">
        <span className="whitespace-pre-line text-center text-2xl">{resultText}</span>
      </div>

      <div className="mt-12 flex items-center justify-center gap-24">
        <div className="flex flex-col gap-3">
          <div>本局贏分</div>
          <div className="text-5xl">{winScore}</div>
        </div>

        <BetControl
          betAmount={betAmount}
          onIncrease={handleIncreaseBet}
          disabled={spinning}
        />

        <SpinButton onClick={handleSpin} disabled={spinning} />
      </div>

      <div className="fixed bottom-0 right-0 mr-4 mb-4 text-lg">
        <button
          type="button"
          onClick={() => setPaytableOpen(true)}
          className="rounded border border-amber-400 px-3 py-1 text-casino-gold hover:bg-amber-400/10"
        >
          查看賠付表
        </button>
      </div>

      <PaytableDialog open={paytableOpen} onClose={() => setPaytableOpen(false)} />
    </div>
  )
}
