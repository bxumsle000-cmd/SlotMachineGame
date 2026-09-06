package com.poz.SlotMachine.controller;

import com.poz.SlotMachine.exception.ApiException;
import com.poz.SlotMachine.model.LoginRequest;
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

    public AuthController(LoginService loginService, RegisterService registerService) {
        this.loginService = loginService;
        this.registerService = registerService;
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

    @GetMapping("/me")
    public Map<String, Integer> me(HttpSession session) {
        Integer memberID = (Integer) session.getAttribute("memberID");
        if (memberID == null) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "尚未登入");
        }
        return Map.of("memberID", memberID);
    }

    @PostMapping("/register")
    public void register(@RequestBody LoginRequest request){
        registerService.registerNewUser(request.username(),request.password());
    }


}
