package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.service.MLService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/ml")
@RequiredArgsConstructor
public class MLController {

    private final MLService mlService;

    @PostMapping("/analyze-resume")
    public ResponseEntity<Object> analyzeResume(@RequestParam("resume") MultipartFile file) {
        return ResponseEntity.ok(mlService.analyzeResume(file));
    }

    @PostMapping("/suggestions")
    public ResponseEntity<Object> getSuggestions(@RequestBody Map<String, Object> stats) {
        return ResponseEntity.ok(mlService.getSuggestions(stats));
    }

    @PostMapping("/readiness-score")
    public ResponseEntity<Object> getReadinessScore(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok(mlService.getReadinessScore(data));
    }
}
