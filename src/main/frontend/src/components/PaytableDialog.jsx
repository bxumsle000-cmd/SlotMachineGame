import { useEffect, useRef, useState } from 'react'
import { api } from '../api/client'
import { MAX_BET, MIN_BET, SYMBOL_ICONS } from '../constants/game'
import payline1 from '../assets/payline-1.png'
import payline2 from '../assets/payline-2.png'
import payline3 from '../assets/payline-3.png'
import payline4 from '../assets/payline-4.png'
import payline5 from '../assets/payline-5.png'

const PAYLINES = [payline1, payline2, payline3, payline4, payline5]

/**
 * 後端給的是一筆一筆的 (符號, 幾連, 倍率)，畫面要的是一個符號一列、
 * 3/4/5 連各一欄，所以在這裡整理成表格用的形狀。
 *
 * multiplier 以總注金為基準，除以線數才是玩家看到的單線倍率。
 */
function toTableRows({ rows, paylineCount }) {
  const bySymbol = new Map()
  for (const { symbol, count, multiplier } of rows) {
    if (!bySymbol.has(symbol)) bySymbol.set(symbol, { symbol, byCount: {} })
    bySymbol.get(symbol).byCount[count] = `${multiplier / paylineCount}x`
  }
  return [...bySymbol.values()]
}

export default function PaytableDialog({ open, onClose }) {
  const dialogRef = useRef(null)
  // 賠付表跟賠率一樣是固定的，所以第一次打開時拉一次就好
  const [tableRows, setTableRows] = useState(null)
  const [loadError, setLoadError] = useState('')

  // <dialog> 的開關只能用 DOM 方法（showModal / close），不能靠 props 直接控制，
  // 所以用 ref 把 React 的 open state 同步過去。
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  useEffect(() => {
    if (!open || tableRows) return
    let cancelled = false
    api
      .paytable()
      .then((data) => !cancelled && setTableRows(toTableRows(data)))
      .catch((error) => !cancelled && setLoadError(error.message))
    return () => {
      cancelled = true
    }
  }, [open, tableRows])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="border border-amber-400 bg-slate-900 px-12 py-6 text-slate-100 backdrop:bg-black/60"
    >
      <h5 className="my-4 text-3xl text-casino-gold">🎰 賠付表（左起連線倍率）</h5>

      {loadError && <p className="py-4 text-red-300">{loadError}</p>}

      {!loadError && !tableRows && <p className="py-4 text-slate-400">載入中…</p>}

      {tableRows && (
        <table className="w-full text-center text-lg">
          <thead>
            <tr className="border-b border-slate-600">
              <th className="py-2">符號</th>
              <th className="py-2">3連</th>
              <th className="py-2">4連</th>
              <th className="py-2">5連</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => (
              <tr key={row.symbol} className="odd:bg-slate-800">
                <td className="py-2">{SYMBOL_ICONS[row.symbol] ?? row.symbol}</td>
                <td className="py-2">{row.byCount[3] ?? '—'}</td>
                <td className="py-2">{row.byCount[4] ?? '—'}</td>
                <td className="py-2">{row.byCount[5] ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="my-8 flex gap-10">
        {PAYLINES.map((src, i) => (
          <img key={src} src={src} alt={`payline-${i + 1}`} className="w-[250px]" />
        ))}
      </div>

      <hr className="border-slate-600" />

      <div className="mt-4 text-2xl">
        <h3 className="mb-3">規則:</h3>
        <p>
          1. 投注金額最低 {MIN_BET} 元，最高 {MAX_BET}
        </p>
        <p>2. ⭐可替代任何符號，以組成最高獎</p>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-amber-400 px-4 py-1 text-lg text-casino-gold hover:bg-amber-400/10"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  )
}
