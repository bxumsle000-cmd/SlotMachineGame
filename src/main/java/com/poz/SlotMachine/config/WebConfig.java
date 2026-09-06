package com.poz.SlotMachine.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 告訴 Spring：LoginInterceptor 要套用在哪些路徑上。
 *
 * 舊版是擋 /game.html。改成 React SPA 之後整個站只有一個 index.html，
 * 伺服器看不到使用者在哪一頁，擋頁面已經沒有意義，所以防線改成擋 API：
 * 只要是需要身分的 /api/**，沒登入就一律 401。
 * 登入、註冊、登出本來就是給還沒登入的人用的，要排除掉。
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor())
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/login", "/api/register", "/api/logout");
    }
}
