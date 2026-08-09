// 按+會加50bet，最多500，超過500則回到 50。
betBtn.addEventListener("click",()=>{
    let betAmount = parseInt(betAmountEL.textContent);
    if(betAmount<500){
        betAmount += 50;
    }else{
        betAmount = 50
    }
    document.getElementById('betAmount').textContent = betAmount;
})
