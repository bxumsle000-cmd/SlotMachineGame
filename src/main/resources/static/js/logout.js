const logoutBtn = document.querySelector("#logoutBtn");


logoutBtn.addEventListener("click", async()=>{
    const res =await fetch("/api/logout", {method: "POST"});
    if(res.ok){
        location.href="/index.html";
    }
} );