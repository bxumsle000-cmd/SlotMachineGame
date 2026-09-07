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
 */
export default function ReelWindow({ symbols, spinNo, duration }) {
  const stripRef = useRef(null)
  // 這一軸目前畫在畫面上的格子：結果 3 格 + 一堆隨機填充格。初始全是 Blank
  const [cells, setCells] = useState(() => Array(ROW_COUNT).fill('Blank'))
  // 記住「cells 是為哪一次轉動排的」，跟 props 的 spinNo 不一樣就代表該重排了
  const [renderedSpinNo, setRenderedSpinNo] = useState(spinNo)

  // 第 1 步：spinNo 一變就重排格子 = 結果 3 格 + 一堆隨機填充格。
  // 這是 React 官方的「props 變了就調整 state」寫法：直接寫在 render 期間，
  // React 會立刻重跑這個元件，畫面只會 commit 一次（比放在 useEffect 少一次繪製）。
  if (renderedSpinNo !== spinNo) {
    setRenderedSpinNo(spinNo)
    const filler = Array.from({ length: FILLER_COUNT }, randomSymbol)
    setCells([...symbols, ...filler])
  }

  // 第 2 步：新格子進 DOM 之後才開始動畫。
  // 用 Web Animations API 直接描述「從最下方捲回原點」這件事，
  // 瀏覽器自己處理起訖狀態，不必手動關開 transition，也不用強制 reflow。
  // 動畫結束後元素回到 CSS 原本的位置（translateY(0)），剛好就是結果那 3 格。
  useLayoutEffect(() => {
    if (spinNo === 0) return
    const strip = stripRef.current
    if (!strip) return

    strip.animate(
      [
        { transform: `translateY(-${CELL_HEIGHT * FILLER_COUNT}px)` },
        { transform: 'translateY(0)' },
      ],
      { duration: duration * 1000, easing: 'ease' },
    )
    // 只依賴 spinNo：轉動期間父層若因為餘額更新而重繪，動畫不會被打斷重來
  }, [spinNo, duration])

  return (
    <div className="h-[240px] w-[130px] overflow-hidden border-2 border-amber-400 shadow-[0_0_8px_rgba(158,28,11,0.9)]">
      <div ref={stripRef} className="flex flex-col">
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
