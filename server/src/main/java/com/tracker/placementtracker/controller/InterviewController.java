package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.Interview;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @GetMapping
    public ResponseEntity<List<Interview>> getInterviews(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(interviewService.getInterviewsByUser(user));
    }

    @PostMapping
    public ResponseEntity<Interview> createInterview(@AuthenticationPrincipal User user, @RequestBody Interview interview) {
        interview.setUser(user);
        return ResponseEntity.ok(interviewService.saveInterview(interview));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
}
