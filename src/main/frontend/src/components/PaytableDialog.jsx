import { useEffect, useRef } from 'react'
import { PAYTABLE_ROWS } from '../constants/game'
import payline1 from '../assets/payline-1.png'
import payline2 from '../assets/payline-2.png'
import payline3 from '../assets/payline-3.png'
import payline4 from '../assets/payline-4.png'
import payline5 from '../assets/payline-5.png'

const PAYLINES = [payline1, payline2, payline3, payline4, payline5]

export default function PaytableDialog({ open, onClose }) {
  const dialogRef = useRef(null)

  // <dialog> 的開關只能用 DOM 方法（showModal / close），不能靠 props 直接控制，
  // 所以用 ref 把 React 的 open state 同步過去。
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="border border-amber-400 bg-slate-900 px-12 py-6 text-slate-100 backdrop:bg-black/60"
    >
      <h5 className="my-4 text-3xl text-casino-gold">🎰 賠付表（左起連線倍率）</h5>

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
          {PAYTABLE_ROWS.map((row) => (
            <tr key={row.symbol} className="odd:bg-slate-800">
              <td className="py-2">{row.symbol}</td>
              <td className="py-2">{row.three}</td>
              <td className="py-2">{row.four}</td>
              <td className="py-2">{row.five}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-8 flex gap-10">
        {PAYLINES.map((src, i) => (
          <img key={src} src={src} alt={`payline-${i + 1}`} className="w-[250px]" />
        ))}
      </div>

      <hr className="border-slate-600" />

      <div className="mt-4 text-2xl">
        <h3 className="mb-3">規則:</h3>
        <p>1. 投注金額最低 50 元，最高 500</p>
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
