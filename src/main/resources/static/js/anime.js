
// 符號顯示對照表：code用英文名，畫面上顯示對應圖示
const SYMBOL_ICONS = {
    Blank: "",
    Cherry: "🍒",
    Lemon: "🍋",
    BAR: "BAR",
    Seven: "7️⃣",
    Wild: "⭐",
}

const STRIPS = document.querySelectorAll(".reel-strip")
const CELL_HEIGHT = 80    // 每格高度(px)，必須跟 CSS 的 .reel-cell height 一致
const FILLER_COUNT = 24   // 轉動時墊在結果下方的填充符號數，越多「轉的距離」越長
const BASE_DURATION = 1 // 第 1 輪的動畫秒數
const STAGGER = 0.25     // 每輪比前一輪多轉的秒數 → 做出左到右依序停止的節奏
const pool= Object.keys(SYMBOL_ICONS)  // symbols type

// 轉換文字成符號， 並加入 reel-cell
function buildCell(symbol) {
    const cell = document.createElement("div")
    cell.className = "reel-cell"
    cell.textContent = SYMBOL_ICONS[symbol]
    return cell
}

// 非同步
// 清空reel-strip -> 取出實際轉出結果，並再後面加入隨機填充符號 -> 瞬間移動到最後一個符號 -> 轉到第一個符號
// -> 轉動完成後resolve
function renderSpin(grid) {
    const spins = [...STRIPS].map((strip,col)=>
    new Promise((resolve) => {
        strip.textContent = ""
        for(let row=0;row<3;row++){
            strip.append(buildCell(grid[row][col]))
        }
        for(let i=0; i<FILLER_COUNT;i++){
            let randomFiller = buildCell(pool[Math.floor(Math.random() * pool.length)] );
            strip.append(randomFiller); }
        strip.style.transition = "none" ;
        strip.style.transform =  `translateY(-${CELL_HEIGHT*FILLER_COUNT}px)`

        strip.offsetHeight

        const duration = BASE_DURATION + STAGGER*col
        strip.style.transition = `transform ${duration}s` ;
        strip.style.transform = "translateY(0)";

        strip.addEventListener("transitionend",()=>{
            resolve()
        },{once:true})
    }))
    return Promise.all(spins)
}

