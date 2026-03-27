package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.Role;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/mentorship")
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
            map.put("username", m.getFullName() != null ? m.getFullName() : "Mentor");
            map.put("email", m.getEmail());
            map.put("role", m.getRole());
            map.put("profile", Map.of(
                "targetRole", "Senior Software Engineer",
                "experience", "5+ Years",
                "rating", 4.8,
                "skills", m.getSkills() != null ? m.getSkills() : List.of()
            ));
            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/sessions")
    public ResponseEntity<List<Map<String, Object>>> getSessions(@AuthenticationPrincipal User user) {
        // Mock sessions for now, could be stored in DB if needed
        return ResponseEntity.ok(List.of());
    }

    @PostMapping("/sessions")
    public ResponseEntity<Map<String, Object>> bookSession(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Requested");
        response.put("message", "Session with mentor ID " + request.get("mentorId") + " requested successfully");
        return ResponseEntity.ok(response);
    }
}
