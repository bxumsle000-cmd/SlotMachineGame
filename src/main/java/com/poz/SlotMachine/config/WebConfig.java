package com.poz.SlotMachine.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 告訴 Spring：LoginInterceptor 要套用在哪些路徑上。
 * 這裡只擋 /game.html，登入頁、css、js、api 都不受影響。
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new LoginInterceptor())
                .addPathPatterns("/game.html");
    }
}
