package com.yedidin.socket.socket_project_last_project.Service;

import com.yedidin.socket.socket_project_last_project.Entity.Event;
import com.yedidin.socket.socket_project_last_project.Entity.User;
import com.yedidin.socket.socket_project_last_project.Repository.EventRepository;
import com.yedidin.socket.socket_project_last_project.Repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService implements IEventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public EventService(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;

    }

    @Override
    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id).map(event -> {
            event.setEventDescription(updatedEvent.getEventDescription());
            event.setLatitude(updatedEvent.getLatitude());
            event.setLongitude(updatedEvent.getLongitude());
            event.setIsDone(updatedEvent.getIsDone());
            event.setPriority(updatedEvent.getPriority());
            event.setDate(updatedEvent.getDate());
            return eventRepository.save(event);
        }).orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }


    @Override
    public void deleteEvent(long eventId) {
        if(!eventRepository.existsById(eventId)) {
            throw new RuntimeException("Event not found");
        }
        eventRepository.deleteById(eventId);
    }

    @Override
    public Optional<Event> getEventById(long eventId) {
        return eventRepository.findById(eventId);
    }

    @Override
    public List<Event> findByUserId(Long userId) {
        return eventRepository.findByUserId(userId);
    }

    @Override
    public List<Event> findByFriendId(Long friendId) {
        return eventRepository.findByFriendId(friendId);
    }

    public List<Event> getEventsForUsers() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(()-> new RuntimeException("User not found"));

        String role = user.getRole().getRoleName();
        if ("ROLE_ADMIN".equals(role)) {
            return eventRepository.findAll();
        } else if ("ROLE_FRIEND".equals(role)) {
            return eventRepository.findByFriend_Id(user.getId());
        } else {
            return eventRepository.findByUser_Id(user.getId());
        }
    }
}
