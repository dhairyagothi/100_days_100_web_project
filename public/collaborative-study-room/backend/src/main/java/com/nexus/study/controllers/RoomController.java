package com.nexus.study.controllers;

import com.nexus.study.models.StudyRoom;
import com.nexus.study.repositories.StudyRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private StudyRoomRepository studyRoomRepository;

    @GetMapping
    public ResponseEntity<List<StudyRoom>> getAllRooms() {
        return ResponseEntity.ok(studyRoomRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<StudyRoom> createRoom(@RequestBody StudyRoom room) {
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        room.setCreator(username);
        
        // Generate a 6-character room code
        String code = java.util.UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        room.setRoomCode(code);
        
        StudyRoom savedRoom = studyRoomRepository.save(room);
        return ResponseEntity.ok(savedRoom);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<StudyRoom> getRoomByCode(@PathVariable String code) {
        return studyRoomRepository.findByRoomCode(code)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
