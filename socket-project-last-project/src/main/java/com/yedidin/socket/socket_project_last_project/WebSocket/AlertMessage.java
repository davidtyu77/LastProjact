package com.yedidin.socket.socket_project_last_project.WebSocket;


import com.yedidin.socket.socket_project_last_project.Entity.User;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlertMessage {

    private String content;
    private String firstName;
    private EventType type;

}
