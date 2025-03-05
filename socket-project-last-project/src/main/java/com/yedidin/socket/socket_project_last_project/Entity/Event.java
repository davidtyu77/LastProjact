package com.yedidin.socket.socket_project_last_project.Entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private Long user_Id;

    @ManyToOne
    @JoinColumn(name = "friend_id", nullable = true)
    private Long friend_Id;

    @Column(name = "latitude", nullable = false)
    private BigDecimal latitude;

    @Column(name = "longitude", nullable = false)
    private BigDecimal longitude;

    @Column(name = "event_description", nullable = false, columnDefinition = "TEXT")
    private String eventDescription;

    @Column(name = "is_done", nullable = false, length = 20)
    private String isDone;

    @Column(name = "priority", length = 20, nullable = false)
    private String priority;

    @Column(name = "date", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime date = LocalDateTime.now();

    // Constructors, getters, and setters
    public Event() {}

    public Event(Long user, Long friend, BigDecimal latitude, BigDecimal longitude, String eventDescription, String isDone, String priority, LocalDateTime date) {
        this.user_Id = user;
        this.friend_Id = friend;
        this.latitude = latitude;
        this.longitude = longitude;
        this.eventDescription = eventDescription;
        this.isDone = isDone;
        this.priority = priority;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUser_Id() {
        return user_Id;
    }

    public void setUser_Id(Long user) {
        this.user_Id = user;
    }

    public Long getFriend_Id() {
        return friend_Id;
    }

    public void setFriend_Id(Long friend) {
        this.friend_Id = friend;
    }

    public BigDecimal getLatitude() {
        return latitude;
    }

    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    public BigDecimal getLongitude() {
        return longitude;
    }

    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public String getIsDone() {
        return isDone;
    }

    public void setIsDone(String isDone) {
        this.isDone = isDone;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }
}
