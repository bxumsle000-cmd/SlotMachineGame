package com.poz.SlotMachine.controller;

import com.poz.SlotMachine.exception.ApiException;
import com.poz.SlotMachine.model.LoginRequest;
import com.poz.SlotMachine.service.GameService;
import com.poz.SlotMachine.service.LoginService;
import com.poz.SlotMachine.service.RegisterService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api")
public class AuthController {
    private final LoginService loginService;
    private final RegisterService registerService;
    private final GameService gameService;

    public AuthController(LoginService loginService, RegisterService registerService, GameService gameService) {
        this.loginService = loginService;
        this.registerService = registerService;
        this.gameService = gameService;
    }

    @PostMapping("/login")
        public void login(@RequestBody LoginRequest request, HttpSession session){
        int memberID = loginService.checkUserID(request.username(),request.password());
        session.setAttribute("memberID",memberID);
    }

    @PostMapping("/logout")
    public void logout(HttpSession session){
        session.invalidate();
    }

    /**
     * 前端進遊戲頁前用它確認身分。
     * 順便把餘額一起回傳，這樣前端不必再打一次 /api/balance（少一次來回）。
     */
    @GetMapping("/me")
    public Map<String, Integer> me(HttpSession session) {
        Integer memberID = (Integer) session.getAttribute("memberID");
        if (memberID == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "尚未登入");
        }
        return Map.of("memberID", memberID, "balance", gameService.getUserBalance(memberID));
    }

    @PostMapping("/register")
    public void register(@RequestBody LoginRequest request){
        registerService.registerNewUser(request.username(),request.password());
    }


}
