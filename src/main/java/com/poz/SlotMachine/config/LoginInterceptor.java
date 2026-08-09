package com.poz.SlotMachine.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 進遊戲頁之前先檢查有沒有登入。
 * preHandle 回傳 true 代表放行，false 代表擋下來（這時請求就不會再往下走）。
 */
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {

        // getSession(false)：只拿現有的 session，沒有就回 null，不要平白建一個新的
        HttpSession session = request.getSession(false);

        // 判斷條件跟 GameController.currentMemberId() 一致
        if (session != null && session.getAttribute("memberID") != null) {
            return true;
        }

        // 沒登入就趕回登入頁
        response.sendRedirect("/index.html");
        return false;
    }
}
