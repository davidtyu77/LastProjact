package com.yedidin.socket.socket_project_last_project.WebSocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new ChatWebSocketHandler(), "/chat")
                .addInterceptors(new HttpSessionHandshakeInterceptor()) // אופציונלי, תלוי אם אתה צריך מזהה משתמש
                .setAllowedOrigins("*"); // אם צריך לאפשר חיבורים מכל השרתים
    }
}