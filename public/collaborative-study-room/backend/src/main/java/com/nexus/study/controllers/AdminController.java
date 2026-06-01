package com.nexus.study.controllers;

import com.nexus.study.models.StudyRoom;
import com.nexus.study.models.User;
import com.nexus.study.repositories.StudyRoomRepository;
import com.nexus.study.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudyRoomRepository studyRoomRepository;

    private boolean isAdmin(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) return false;
        Optional<User> userOpt = userRepository.findByUsername(authentication.getName());
        return userOpt.isPresent() && "ADMIN".equals(userOpt.get().getRole());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication authentication) {
        if (!isAdmin(authentication)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));

        long userCount = userRepository.count();
        long roomCount = studyRoomRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userCount);
        stats.put("totalRooms", roomCount);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(Authentication authentication) {
        if (!isAdmin(authentication)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
        List<User> users = userRepository.findAll();
        // sanitize passwords
        users.forEach(u -> u.setPassword(null));
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Authentication authentication) {
        if (!isAdmin(authentication)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
        userRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @GetMapping("/rooms")
    public ResponseEntity<?> getAllRooms(Authentication authentication) {
        if (!isAdmin(authentication)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
        List<StudyRoom> rooms = studyRoomRepository.findAll();
        return ResponseEntity.ok(rooms);
    }

    @DeleteMapping("/rooms/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable Long id, Authentication authentication) {
        if (!isAdmin(authentication)) return ResponseEntity.status(403).body(Map.of("message", "Forbidden"));
        studyRoomRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Room deleted successfully"));
    }
}
