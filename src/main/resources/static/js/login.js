const loginBtn = document.querySelector("#loginBtn");
const registerBtnEL = document.querySelector("#registerBtn");
const errorMsgEL = document.querySelector("#errorMsg");

function showErrorMsg(text) {
    errorMsgEL.textContent= text;
    errorMsgEL.classList.remove("d-none");
}

function clearErrorMsg() {
    errorMsgEL.classList.add("d-none");
}

async function login(username, password) {
    const res = await fetch(`/api/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({ username, password })
    })
    if(res.ok){
    return true;
    }
}

async function register(username, password) {
    const res = await fetch(`/api/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({ username, password })
    })
    if(res.ok){
        return true;
    }
}

loginBtn.addEventListener("click", async (event)=>{
    event.preventDefault()
    clearErrorMsg();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const success = await login(username, password);

    if(success){
        location.href = "/game.html";
    }else{
        showErrorMsg("登入失敗，請確認帳號密碼") ;
    }
});


registerBtnEL.addEventListener("click", async (event)=>{
    event.preventDefault()
    clearErrorMsg();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const success = await register(username, password);

    if(success){
        alert("註冊帳號成功")
    }else{
        showErrorMsg("註冊失敗");
    }
});