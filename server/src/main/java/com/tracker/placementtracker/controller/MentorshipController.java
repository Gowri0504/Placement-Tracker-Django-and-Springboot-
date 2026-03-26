package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.Role;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class MentorshipController {

    private final UserRepository userRepository;

    @GetMapping("/mentors")
    public ResponseEntity<List<Map<String, Object>>> getMentors() {
        // Return users with role MENTOR
        List<User> mentors = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.MENTOR)
                .toList();
        
        List<Map<String, Object>> response = mentors.stream().map(m -> {
            Map<String, Object> map = new HashMap<>();
            map.put("_id", m.getId());
            map.put("username", m.getFullName());
            map.put("email", m.getEmail());
            map.put("role", m.getRole());
            map.put("profile", Map.of("targetRole", "Senior Software Engineer"));
            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/mentorship/sessions")
    public ResponseEntity<List<Map<String, Object>>> getSessions() {
        // Mock sessions for now
        return ResponseEntity.ok(Collections.emptyList());
    }

    @PostMapping("/mentorship/sessions")
    public ResponseEntity<Map<String, Object>> bookSession(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Requested");
        response.put("message", "Session requested successfully");
        return ResponseEntity.ok(response);
    }
}
