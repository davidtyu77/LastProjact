package com.yedidin.socket.socket_project_last_project.chat;


import lombok.*;


@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    private String content;
    private String sender;
    private EventType type;


    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public EventType getType() {
        return type;
    }

    public void setType(EventType type) {
        this.type = type;
    }
}
