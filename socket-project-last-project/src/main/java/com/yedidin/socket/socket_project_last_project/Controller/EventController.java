package com.yedidin.socket.socket_project_last_project.Controller;


import com.yedidin.socket.socket_project_last_project.Entity.Event;
import com.yedidin.socket.socket_project_last_project.Service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private EventService eventService;

    public EventController (EventService eventService) {
        eventService = this.eventService;
    }

    @GetMapping
    public List<Event> getAllEvents(){
        return eventService.getEventsForUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> event = eventService.getEventById(id);
        return event.map(ResponseEntity::ok).orElseGet(() ->
                ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        return ResponseEntity.ok(eventService.createEvent(event));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id,
                                             @RequestBody Event event) {
        return ResponseEntity.ok(eventService.updateEvent(id, event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvents(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    // קבלת אירועים לפי ID של משתמש
    @GetMapping("/user/{userId}")
    public List<Event> getEventsByUserId(@PathVariable Long userId) {
        return eventService.findByUserId(userId);
    }

    // קבלת אירועים לפי ID של חבר
    @GetMapping("/friend/{friendId}")
    public List<Event> getEventsByFriendId(@PathVariable Long friendId) {
        return eventService.findByFriendId(friendId);
    }
}
