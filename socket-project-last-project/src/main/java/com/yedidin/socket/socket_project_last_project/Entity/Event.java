package com.yedidin.socket.socket_project_last_project.Entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    @Column(nullable = false)
    private String userid;

    @Column(nullable = false)
    private String yedidId;

    @Column(nullable = false)
    private String coordinates;

    @Column(nullable = false)
    private String eventDescription;

    @Column(nullable = false)
    private String priority;
}
