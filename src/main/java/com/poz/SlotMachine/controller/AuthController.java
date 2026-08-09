package com.poz.SlotMachine.controller;

import com.poz.SlotMachine.model.LoginRequest;
import com.poz.SlotMachine.service.LoginService;
import com.poz.SlotMachine.service.RegisterService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.net.http.HttpRequest;

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

    @PostMapping("/register")
    public void register(@RequestBody LoginRequest request){
        registerService.registerNewUser(request.username(),request.password());
    }


}
