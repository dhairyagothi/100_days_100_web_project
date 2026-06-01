package com.nexus.study.controllers;

import com.nexus.study.models.Note;
import com.nexus.study.repositories.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
public class NotesController {

    @Autowired
    private NoteRepository noteRepository;

    @GetMapping("/{roomId}")
    public ResponseEntity<Note> getNote(@PathVariable Long roomId) {
        Optional<Note> noteOpt = noteRepository.findById(roomId);
        if (noteOpt.isEmpty()) {
            // Return default empty note representation
            return ResponseEntity.ok(new Note(roomId, ""));
        }
        return ResponseEntity.ok(noteOpt.get());
    }

    @PutMapping("/{roomId}")
    public ResponseEntity<Note> saveNote(@PathVariable Long roomId, @RequestBody Map<String, String> request) {
        String content = request.getOrDefault("content", "");
        Note note = new Note(roomId, content);
        Note saved = noteRepository.save(note);
        return ResponseEntity.ok(saved);
    }
}
