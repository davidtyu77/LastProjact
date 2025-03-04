package com.yedidin.socket.socket_project_last_project.chat;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
public ChatMessage sendMessage(
        @Payload ChatMessage chatMessage
){

    return chatMessage;
}


@MessageMapping("/chat.addUser")
@SendTo("/topic/public")
public ChatMessage addUser(
        @Payload ChatMessage chatMessage,
        SimpMessageHeaderAccessor headerAccessor
){
        //add username in web socket session
    headerAccessor.getSessionAttributes().put("username",chatMessage.getSender());
    return  chatMessage;
}

}


