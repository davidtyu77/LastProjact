package com.yedidin.socket.socket_project_last_project.WebSocket;

import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class AlertController {

    @MessageMapping("/chat.sendAlert")
    @SendTo("/topic/public")
public AlertMessage sendAlert(
        @Payload AlertMessage alertMessage
){

    return alertMessage;
}


@MessageMapping("/chat.addUser")
@SendTo("/topic/public")
public AlertMessage addUser(
        @Payload AlertMessage alertMessage,
        SimpMessageHeaderAccessor headerAccessor
){
        //add username in web socket session
    headerAccessor.getSessionAttributes().put("username",alertMessage.getFirstName());
    return  alertMessage;
}

}


