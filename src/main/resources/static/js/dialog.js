// dialog 設定
paytableDialog = document.querySelector("#paytableDialog")
paylineTable = document.querySelector("#paylineTable")
closeRule = document.querySelector("#closeRule")

paylineTable.addEventListener("click",()=> {paytableDialog.showModal()})
closeRule.addEventListener("click",()=> {paytableDialog.close()})