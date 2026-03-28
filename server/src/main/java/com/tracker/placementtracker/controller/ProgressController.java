package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.Progress;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/save")
    public ResponseEntity<Progress> saveProgress(@AuthenticationPrincipal User user, @RequestBody Progress progress) {
        return ResponseEntity.ok(progressService.saveProgress(user, progress));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Progress>> getProgressByUser(@PathVariable Long id) {
        return ResponseEntity.ok(progressService.getProgressByUser(id));
    }
}
