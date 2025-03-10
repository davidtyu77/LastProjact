package com.yedidin.socket.socket_project_last_project.WebSocket;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AlertMessage {

    private EventType eventType;
    private long eventId;
    private String content;
    private Long userId;
    private Long friendId;
    private String status;
    private LocalDateTime timestamp;
    private double latitude;
    private String priority;
    private double longitude; // תיקון השם משגיאת כתיב

}
