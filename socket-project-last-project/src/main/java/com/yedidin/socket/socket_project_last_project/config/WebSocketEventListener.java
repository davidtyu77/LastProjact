package com.yedidin.socket.socket_project_last_project.config;

import com.yedidin.socket.socket_project_last_project.WebSocket.AlertMessage;
import com.yedidin.socket.socket_project_last_project.WebSocket.AlertMessage;
import com.yedidin.socket.socket_project_last_project.WebSocket.EventType;
import com.yedidin.socket.socket_project_last_project.WebSocket.EventType;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    public  SimpMessageSendingOperations messageTemplate;

    @EventListener
    public void handleWebSocketDisconnectListener(
            SessionDisconnectEvent event
    ){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if(username != null){
            log.info("User disconnect {}",username);
            var eventMessage = AlertMessage.builder()
                    .type(EventType.LEAVE)
                    .firstName(username)
                    .build();
            messageTemplate.convertAndSend("/topic/public",eventMessage);
        }
    }
}