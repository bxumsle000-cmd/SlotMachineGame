const balanceEL = document.querySelector("#balance");
const resultEL = document.querySelector("#result");
const winScoreEL = document.querySelector("#winScore");
const betAmountEL = document.querySelector("#betAmount");
const spinBtn = document.querySelector("#spinBtn");
const betBtn = document.querySelector("#betBtn");



async function getCurrentBalance() {
    const res = await fetch("/api/balance");
    const data = await res.json();
    balanceEL.textContent = data.balance;
}
getCurrentBalance();

async function spin(betAmount) {
    const res = await fetch(
        `/api/spin?betAmount=${betAmount}`, {method: "POST"})
    const data = await res.json();
    return data;
}

spinBtn.addEventListener("click", async ()=>{
    const InitialBalance = parseInt(balanceEL.textContent);
    const betAmount = parseInt(betAmountEL.textContent) ;
    if(InitialBalance<betAmount){
        resultEL.textContent = "餘額不足";
        return;
    }
    spinBtn.disabled = true;
    betBtn.disabled = true;
    const data = await spin(betAmount);
    const winAmount = parseInt(data.winAmount);
    const grid = data.grid;
    const winPayable = data.winPayable;

    const afterBet = InitialBalance - betAmount ;
    const finalBalance = afterBet + winAmount ;
    balanceEL.textContent =  afterBet;
    await renderSpin(data.grid);
    winScoreEL.textContent = winAmount;
    balanceEL.textContent = finalBalance;
    let result = "";
    if(winAmount>0){
        for(let payable of winPayable){
            let symbol = payable.symbol;
            let count = payable.count;
            let multiplier = payable.multiplier;
            result+=`${SYMBOL_ICONS[symbol]}    ${count}連線  ${multiplier/5}X \n`
        }
        resultEL.textContent = result;
    }else {
        resultEL.textContent = "再接再厲";
    }

    spinBtn.disabled = false;
    betBtn.disabled = false;
});


