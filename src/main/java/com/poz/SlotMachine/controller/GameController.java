package com.poz.SlotMachine.controller;

import com.poz.SlotMachine.exception.ApiException;
import com.poz.SlotMachine.model.SpinResponse;
import com.poz.SlotMachine.service.GameService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class GameController {
    private  final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    private int currentUserID(HttpSession session){
        Integer memberID = (Integer) session.getAttribute("memberID");
        if (memberID == null){
            throw new ApiException(HttpStatus.UNAUTHORIZED, "尚未登入");
        }
        return  memberID;
    }

    @GetMapping("/balance")
    public Map<String,Integer> balance(HttpSession session){
        int memberID = currentUserID(session);
        return Map.of("balance",gameService.getUserBalance(memberID)) ;
    }

    @PostMapping("/spin")
    public SpinResponse spin(@RequestParam int betAmount,HttpSession session){
        int memberID = currentUserID(session);
        SpinResponse results = gameService.dospin(memberID,betAmount);
        return results;
    }
}
