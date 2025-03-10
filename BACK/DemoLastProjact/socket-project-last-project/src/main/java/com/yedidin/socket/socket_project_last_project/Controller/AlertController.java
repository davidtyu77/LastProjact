package com.yedidin.socket.socket_project_last_project.Controller;

import com.yedidin.socket.socket_project_last_project.WebSocket.AlertMessage;
import com.yedidin.socket.socket_project_last_project.WebSocket.EventType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class AlertController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public AlertController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Handle events for regular users
    @MessageMapping("/users/events/create")
    @SendTo("/topic/users/events/EVENT_CREATED")
    public AlertMessage handleUserEventCreation(AlertMessage message) {
        // Also send to combined channel
        messagingTemplate.convertAndSend("/topic/users/events", message);
        return message;
    }

    @MessageMapping("/users/events/update")
    @SendTo("/topic/users/events/EVENT_UPDATED")
    public AlertMessage handleUserEventUpdate(AlertMessage message) {
        // Also send to combined channel
        messagingTemplate.convertAndSend("/topic/users/events", message);
        return message;
    }

    // Handle events for friends
    @MessageMapping("/friends/events/assign")
    @SendTo("/topic/friends/events/EVENT_ASSIGNED")
    public AlertMessage handleFriendEventAssignment(AlertMessage message) {
        // Also send to combined channel
        messagingTemplate.convertAndSend("/topic/friends/events", message);
        return message;
    }

    @MessageMapping("/friends/events/status")
    @SendTo("/topic/friends/events/STATUS_CHANGED")
    public AlertMessage handleFriendStatusUpdate(AlertMessage message) {
        // Also send to combined channel
        messagingTemplate.convertAndSend("/topic/friends/events", message);
        return message;
    }

    // Handle events for admins
    @MessageMapping("/admin/events")
    @SendTo("/topic/admin/events")
    public AlertMessage handleAdminEvent(AlertMessage message) {
        // Also send to specific event type channel based on message type
        EventType eventType = message.getEventType();
        if (eventType != null ) {
            messagingTemplate.convertAndSend("/topic/admin/events/" + eventType, message);
        }
        return message;
    }

    @MessageMapping("/admin/events/update")
    @SendTo("/topic/admin/events/EVENT_UPDATED")
    public AlertMessage handleAdminEventUpdate(AlertMessage message) {
        // Also send to combined channel
        messagingTemplate.convertAndSend("/topic/admin/events", message);
        return message;
    }

    @MessageMapping("/admin/events/delete")
    @SendTo("/topic/admin/events/EVENT_DELETED")
    public AlertMessage handleAdminEventDelete(AlertMessage message) {
        // Also send to combined channel
        messagingTemplate.convertAndSend("/topic/admin/events", message);
        return message;
    }

    // Generic event handlers
    @MessageMapping("/events/assign")
    public void handleEventAssignment(AlertMessage message) {
        // Send to appropriate topic based on role
        messagingTemplate.convertAndSend("/topic/users/events/EVENT_ASSIGNED", message);
        messagingTemplate.convertAndSend("/topic/friends/events/EVENT_ASSIGNED", message);
        messagingTemplate.convertAndSend("/topic/admin/events/EVENT_ASSIGNED", message);

        // Also send to combined channels
        messagingTemplate.convertAndSend("/topic/users/events", message);
        messagingTemplate.convertAndSend("/topic/friends/events", message);
        messagingTemplate.convertAndSend("/topic/admin/events", message);
    }

    @MessageMapping("/events/status")
    public void handleEventStatusUpdate(AlertMessage message) {
        // Send to appropriate topic based on role
        messagingTemplate.convertAndSend("/topic/users/events/STATUS_CHANGED", message);
        messagingTemplate.convertAndSend("/topic/friends/events/STATUS_CHANGED", message);
        messagingTemplate.convertAndSend("/topic/admin/events/STATUS_CHANGED", message);

        // Also send to combined channels
        messagingTemplate.convertAndSend("/topic/users/events", message);
        messagingTemplate.convertAndSend("/topic/friends/events", message);
        messagingTemplate.convertAndSend("/topic/admin/events", message);
    }

    @MessageMapping("/events/delete")
    public void handleEventDelete(AlertMessage message) {
        // Send to appropriate topic
        messagingTemplate.convertAndSend("/topic/users/events/EVENT_DELETED", message);
        messagingTemplate.convertAndSend("/topic/friends/events/EVENT_DELETED", message);
        messagingTemplate.convertAndSend("/topic/admin/events/EVENT_DELETED", message);

        // Also send to combined channels
        messagingTemplate.convertAndSend("/topic/users/events", message);
        messagingTemplate.convertAndSend("/topic/friends/events", message);
        messagingTemplate.convertAndSend("/topic/admin/events", message);
    }

    @MessageMapping("/events/update")
    public void handleEventUpdate(AlertMessage message) {
        // Send to appropriate topic
        messagingTemplate.convertAndSend("/topic/users/events/EVENT_UPDATED", message);
        messagingTemplate.convertAndSend("/topic/admin/events/EVENT_UPDATED", message);

        // Also send to combined channels
        messagingTemplate.convertAndSend("/topic/users/events", message);
        messagingTemplate.convertAndSend("/topic/admin/events", message);
    }
}