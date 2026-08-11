package com.poz.SlotMachine.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * 密碼雜湊器。
 *
 * BCryptPasswordEncoder 是 thread-safe，但內含 SecureRandom，建立成本不低，
 * 所以做成單例 bean 交給 Spring 注入，不要在每次登入時 new 一個。
 *
 * 回傳型別刻意宣告成介面 PasswordEncoder 而非 BCryptPasswordEncoder，
 * 將來要換成 Argon2 之類的演算法時只改這個檔案，Service 端不用動。
 */
@Configuration
public class PasswordConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // 預設 strength = 10。數字越大越慢也越安全，
        // 慢是刻意的（讓暴力破解變貴），不要為了登入快而調低。
        return new BCryptPasswordEncoder();
    }
}
