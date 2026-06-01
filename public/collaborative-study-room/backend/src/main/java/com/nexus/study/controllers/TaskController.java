package com.nexus.study.controllers;

import com.nexus.study.models.StudyTask;
import com.nexus.study.repositories.StudyTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private StudyTaskRepository studyTaskRepository;

    @GetMapping("/{roomId}")
    public ResponseEntity<List<StudyTask>> getTasksByRoom(@PathVariable Long roomId) {
        return ResponseEntity.ok(studyTaskRepository.findByRoomId(roomId));
    }

    @PostMapping("/{roomId}")
    public ResponseEntity<StudyTask> addTask(@PathVariable Long roomId, @RequestBody Map<String, String> request) {
        String text = request.get("text");
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        StudyTask task = new StudyTask(text, username, roomId);
        StudyTask saved = studyTaskRepository.save(task);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{taskId}/toggle")
    public ResponseEntity<?> toggleTask(@PathVariable Long taskId) {
        Optional<StudyTask> taskOpt = studyTaskRepository.findById(taskId);
        if (taskOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        StudyTask task = taskOpt.get();
        task.setCompleted(!task.isCompleted());
        studyTaskRepository.save(task);

        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        if (!studyTaskRepository.existsById(taskId)) {
            return ResponseEntity.notFound().build();
        }

        studyTaskRepository.deleteById(taskId);
        return ResponseEntity.ok(Map.of("message", "Task deleted successfully"));
    }
}
