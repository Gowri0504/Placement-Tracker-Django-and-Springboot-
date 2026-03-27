package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.dto.AuthenticationRequest;
import com.tracker.placementtracker.dto.AuthenticationResponse;
import com.tracker.placementtracker.dto.RegisterRequest;
import com.tracker.placementtracker.service.AuthenticationService;
import com.tracker.placementtracker.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal User user, @RequestBody User profileRequest) {
        return ResponseEntity.ok(service.updateProfile(user, profileRequest));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users")
    public ResponseEntity<java.util.List<User>> getAllUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    @GetMapping("/mentors")
    public ResponseEntity<java.util.List<User>> getMentors() {
        return ResponseEntity.ok(service.getAllUsers().stream()
                .filter(u -> u.getRole() == com.tracker.placementtracker.entity.Role.MENTOR)
                .toList());
    }
}
