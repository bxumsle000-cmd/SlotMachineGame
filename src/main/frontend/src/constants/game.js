// 符號顯示對照表：後端回傳英文代號，畫面上顯示對應圖示
export const SYMBOL_ICONS = {
  Blank: '',
  Cherry: '🍒',
  Lemon: '🍋',
  BAR: 'BAR',
  Seven: '7️⃣',
  Wild: '⭐',
}

export const SYMBOL_POOL = Object.keys(SYMBOL_ICONS)

export function randomSymbol() {
  return SYMBOL_POOL[Math.floor(Math.random() * SYMBOL_POOL.length)]
}

// ---- 轉軸動畫參數 ----
export const REEL_COUNT = 5   // 幾個轉軸（欄）
export const ROW_COUNT = 3    // 每個轉軸露出幾格（列）
export const CELL_HEIGHT = 80 // 每格高度(px)，必須跟 ReelWindow 的 h-20 一致
export const FILLER_COUNT = 24 // 轉動時墊在結果下方的填充符號數，越多「轉的距離」越長
export const BASE_DURATION = 1 // 第 1 軸的動畫秒數
export const STAGGER = 0.25    // 每軸比前一軸多轉的秒數 → 做出左到右依序停止的節奏

// ---- 下注規則（對應後端 BetConfig）----
export const MIN_BET = 50
export const MAX_BET = 500
export const BET_STEP = 50

// ---- 賠付表（顯示倍率 = 後端 PayableConfig 的 multiplier / 5）----
export const PAYTABLE_ROWS = [
  { symbol: '7', three: '10x', four: '20x', five: '100x' },
  { symbol: 'BAR', three: '2x', four: '5x', five: '20x' },
  { symbol: '🍒', three: '1x', four: '2x', five: '10x' },
  { symbol: '🍋', three: '0.6x', four: '1x', five: '5x' },
]
