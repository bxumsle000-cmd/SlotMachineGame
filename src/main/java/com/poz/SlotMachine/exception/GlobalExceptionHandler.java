package com.poz.SlotMachine.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, String>> handleApiException(ApiException e) {
        // 第 1 步：拿到狀態碼
        HttpStatus status = e.getStatus();

// 第 2 步：拿到訊息
        String message = e.getMessage();

// 第 3 步：做一個 Map，內容是 { "message": 訊息 }
        Map<String, String> body = Map.of("message", message);

// 第 4 步：用狀態碼開始建立回應，再把 body 塞進去
        ResponseEntity<Map<String, String>> response =
                ResponseEntity.status(status).body(body);

        return response;
    }
}
