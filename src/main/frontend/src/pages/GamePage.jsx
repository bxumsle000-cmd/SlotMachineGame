import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import {
  BASE_DURATION,
  BET_STEP,
  MAX_BET,
  MIN_BET,
  REEL_COUNT,
  ROW_COUNT,
  STAGGER,
  SYMBOL_ICONS,
} from '../constants/game'
import BetControl from '../components/BetControl'
import Header from '../components/Header'
import PaytableDialog from '../components/PaytableDialog'
import ReelWindow from '../components/ReelWindow'
import SpinButton from '../components/SpinButton'

// 後端的 grid 是 grid[列][欄]，但每個轉軸要的是「同一欄的 3 個符號」，
// 所以這裡把它轉置一下。
function columnSymbols(grid, col) {
  if (!grid) return Array(ROW_COUNT).fill('Blank')
  return Array.from({ length: ROW_COUNT }, (_, row) => grid[row][col])
}

export default function GamePage() {
  const [balance, setBalance] = useState(null)
  const [betAmount, setBetAmount] = useState(MIN_BET)
  const [winScore, setWinScore] = useState(0)
  const [resultText, setResultText] = useState('準備好就spin!')
  const [grid, setGrid] = useState(null)
  const [spinNo, setSpinNo] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [paytableOpen, setPaytableOpen] = useState(false)
  const navigate = useNavigate()

  // 5 個轉軸各自跑完動畫才算結束。用 ref 記錄「已停幾軸」和「要通知誰」，
  // 效果等同舊版 anime.js 的 Promise.all。
  const finishedRef = useRef(0)
  const resolveRef = useRef(null)

  const handleReelFinish = useCallback(() => {
    finishedRef.current += 1
    if (finishedRef.current >= REEL_COUNT && resolveRef.current) {
      resolveRef.current()
      resolveRef.current = null
    }
  }, [])

  function waitForReels() {
    finishedRef.current = 0
    return new Promise((resolve) => {
      resolveRef.current = resolve
    })
  }

  useEffect(() => {
    api
      .balance()
      .then((data) => setBalance(data.balance))
      .catch(() => navigate('/', { replace: true }))
  }, [navigate])

  async function handleLogout() {
    try {
      await api.logout()
    } finally {
      navigate('/', { replace: true })
    }
  }

  function handleIncreaseBet() {
    // 按 + 加 50，超過上限就繞回最低額（跟舊版 betConfig.js 一致）
    setBetAmount((current) => (current < MAX_BET ? current + BET_STEP : MIN_BET))
  }

  async function handleSpin() {
    if (balance === null) return
    if (balance < betAmount) {
      setResultText('餘額不足')
      return
    }

    setSpinning(true)
    const initialBalance = balance

    try {
      const data = await api.spin(betAmount)

      // 先扣掉注金，讓餘額在轉動期間就反映出來
      setBalance(initialBalance - betAmount)

      const reelsStopped = waitForReels()
      setGrid(data.grid)
      setSpinNo((n) => n + 1)
      await reelsStopped

      setWinScore(data.winAmount)
      setBalance(initialBalance - betAmount + data.winAmount)

      if (data.winAmount > 0) {
        const lines = data.winPayable.map(
          ({ symbol, count, multiplier }) =>
            `${SYMBOL_ICONS[symbol]}    ${count}連線  ${multiplier / 5}X`,
        )
        setResultText(lines.join('\n'))
      } else {
        setResultText('再接再厲')
      }
    } catch (error) {
      setResultText(error.message)
      setBalance(initialBalance)
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
            symbols={columnSymbols(grid, col)}
            spinNo={spinNo}
            duration={BASE_DURATION + STAGGER * col}
            onFinish={handleReelFinish}
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
