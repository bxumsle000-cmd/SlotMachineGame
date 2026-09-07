package com.poz.SlotMachine.controller;

import com.poz.SlotMachine.constant.PayableConfig;
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

    /**
     * 賠付表。前端原本自己硬編了一份顯示用的倍率，改成跟後端拿同一份資料，
     * 賠率調整時只需要改 PayableConfig 一個地方。
     *
     * multiplier 是以「總注金」為基準，除以 paylineCount 才是玩家看到的單線倍率，
     * 所以把線數一起回傳，換算規則不必在前端硬編。
     */
    @GetMapping("/paytable")
    public Map<String,Object> paytable(){
        return Map.of(
                "paylineCount", PayableConfig.Paylines.size(),
                "rows", PayableConfig.Paytables
        );
    }
}
