package com.poz.SlotMachine.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * React Router 的路由（例如 /game）只存在於瀏覽器端，伺服器上沒有對應的檔案。
 * 使用者直接輸入網址或按重新整理時，請求會打到後端，若不處理就會 404。
 *
 * 這裡把「單層、不含副檔名」的路徑一律 forward 回 index.html，
 * 讓 React Router 自己去決定要顯示哪一頁。
 *
 * 正則 [^.]* 排除掉含有「.」的路徑，所以 /assets/index-xxx.js、/favicon.svg
 * 這些真實靜態檔不會被攔走；/api/**、/swagger-ui/** 是多層路徑，也不會被比對到。
 */
@Controller
public class SpaController {

    @GetMapping(value = {"/", "/{path:[^.]*}"})
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
