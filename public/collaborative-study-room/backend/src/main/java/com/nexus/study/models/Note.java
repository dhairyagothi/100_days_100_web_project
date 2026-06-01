package com.nexus.study.models;

import jakarta.persistence.*;

@Entity
@Table(name = "study_notes")
public class Note {

    @Id
    private Long roomId;

    @Column(columnDefinition = "TEXT")
    private String content;

    public Note() {
    }

    public Note(Long roomId, String content) {
        this.roomId = roomId;
        this.content = content;
    }

    // Getters and Setters
    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
