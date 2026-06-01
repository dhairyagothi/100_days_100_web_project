package com.nexus.study.controllers;

import com.nexus.study.models.User;
import com.nexus.study.repositories.UserRepository;
import com.nexus.study.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @org.springframework.beans.factory.annotation.Value("${admin.email:admin@nexus.com}")
    private String adminEmail;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String email = request.get("email");
        String password = request.get("password");
        String avatar = request.getOrDefault("avatar", "🦉");

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken!"));
        }

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email Address already in use!"));
        }

        // Hash credentials
        User user = new User(username, email, passwordEncoder.encode(password), avatar);
        user.getBadgesUnlocked().add("first_step"); // Initial sign up badge
        
        if (email.equalsIgnoreCase(adminEmail)) {
            user.setRole("ADMIN");
        }

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Invalid Email or Password!"));
        }

        User user = userOpt.get();
        String token = tokenProvider.generateToken(user.getUsername());

        // Package metadata with JWT
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getUsername());
        response.put("email", user.getEmail());
        response.put("avatar", user.getAvatar());
        response.put("xp", user.getXp());
        response.put("level", user.getLevel());
        response.put("badgesUnlocked", user.getBadgesUnlocked());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }
}
