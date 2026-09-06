import { useLayoutEffect, useRef, useState } from 'react'
import {
  CELL_HEIGHT,
  FILLER_COUNT,
  ROW_COUNT,
  SYMBOL_ICONS,
  randomSymbol,
} from '../constants/game'

/**
 * 單一轉軸。
 *
 * @param symbols  這一軸最後要停在的 3 個符號（由上到下）
 * @param spinNo   轉動流水號；每按一次 Spin 就 +1，用它當觸發訊號
 * @param duration 這一軸的動畫秒數（越右邊越長 → 做出依序停止的節奏）
 * @param onFinish 動畫結束時通知父層
 */
export default function ReelWindow({ symbols, spinNo, duration, onFinish }) {
  const stripRef = useRef(null)
  const [cells, setCells] = useState(() => Array(ROW_COUNT).fill('Blank'))
  const [renderedSpinNo, setRenderedSpinNo] = useState(spinNo)

  // 第 1 步：spinNo 一變就重排格子 = 結果 3 格 + 一堆隨機填充格。
  // 這是 React 官方的「props 變了就調整 state」寫法：直接寫在 render 期間，
  // React 會立刻重跑這個元件，畫面只會 commit 一次（比放在 useEffect 少一次繪製）。
  if (renderedSpinNo !== spinNo) {
    setRenderedSpinNo(spinNo)
    const filler = Array.from({ length: FILLER_COUNT }, randomSymbol)
    setCells([...symbols, ...filler])
  }

  // 第 2 步：新格子已經進 DOM 之後才開始動畫。
  // 用 useLayoutEffect（而非 useEffect）是因為它在瀏覽器繪製前執行，
  // 「瞬間移到底」這個中間狀態才不會閃給使用者看到。
  useLayoutEffect(() => {
    if (spinNo === 0) return
    const strip = stripRef.current
    if (!strip) return

    // 先關掉 transition，瞬間跳到最下方（此時畫面上是填充格）
    strip.style.transition = 'none'
    strip.style.transform = `translateY(-${CELL_HEIGHT * FILLER_COUNT}px)`

    // 強制瀏覽器立刻重算版面。少了這行，瀏覽器會把上下兩次 transform
    // 合併成一次，結果就是「直接跳到結果」，完全看不到轉動過程。
    void strip.offsetHeight

    // 再打開 transition 捲回原點 → 產生由上往下捲的轉動效果
    strip.style.transition = `transform ${duration}s`
    strip.style.transform = 'translateY(0)'
    // 只依賴 spinNo：轉動期間父層若因為餘額更新而重繪，動畫不會被打斷重來
  }, [spinNo, duration])

  return (
    <div className="h-[240px] w-[130px] overflow-hidden border-2 border-amber-400 shadow-[0_0_8px_rgba(158,28,11,0.9)]">
      <div ref={stripRef} className="flex flex-col" onTransitionEnd={onFinish}>
        {cells.map((symbol, i) => (
          <div
            key={i}
            className="flex h-20 shrink-0 items-center justify-center text-[2rem]"
          >
            {SYMBOL_ICONS[symbol]}
          </div>
        ))}
      </div>
    </div>
  )
}
