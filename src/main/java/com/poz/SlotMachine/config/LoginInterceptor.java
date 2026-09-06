package com.poz.SlotMachine.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 每支需要登入的 API 進來之前先檢查 session。
 * preHandle 回傳 true 代表放行，false 代表擋下來（這時請求就不會再往下走）。
 *
 * 前端改成 React SPA 之後，這裡不能再用 sendRedirect：
 * fetch 收到 302 會自動跟著跳轉，前端拿到的是登入頁的 HTML 而不是錯誤，
 * 根本分不出「失敗了」。所以改成回 401 + 跟 GlobalExceptionHandler 一樣的
 * { "message": ... } 格式，前端統一用 ApiError 處理。
 */
public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {

        // getSession(false)：只拿現有的 session，沒有就回 null，不要平白建一個新的
        HttpSession session = request.getSession(false);

        // 判斷條件跟 GameController.currentUserID() 一致
        if (session != null && session.getAttribute("memberID") != null) {
            return true;
        }

        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"message\":\"尚未登入\"}");
        return false;
    }
}
