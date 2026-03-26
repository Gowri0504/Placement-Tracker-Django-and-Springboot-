package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.Interview;
import com.tracker.placementtracker.entity.MockInterview;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.repository.MockInterviewRepository;
import com.tracker.placementtracker.service.InterviewService;
import com.tracker.placementtracker.service.MLService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;
    private final MLService mlService;
    private final MockInterviewRepository mockInterviewRepository;

    @GetMapping
    public ResponseEntity<List<MockInterview>> getInterviews(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(mockInterviewRepository.findByUser(user));
    }

    @GetMapping("/leetcode-daily")
    public ResponseEntity<Map<String, Object>> getLeetCodeDaily() {
        Map<String, Object> daily = new HashMap<>();
        daily.put("id", 1);
        daily.put("title", "Two Sum");
        daily.put("difficulty", "Easy");
        daily.put("link", "https://leetcode.com/problems/two-sum/");
        return ResponseEntity.ok(daily);
    }

    @PostMapping("/start")
    public ResponseEntity<Object> startMockInterview(@AuthenticationPrincipal User user, @RequestBody Map<String, Object> request) {
        Map<String, Object> mlResponse = (Map<String, Object>) mlService.startMockInterview(request);
        
        List<Map<String, Object>> questions = (List<Map<String, Object>>) mlResponse.get("questions");
        
        MockInterview interview = MockInterview.builder()
                .user(user)
                .type((String) request.get("type"))
                .status("In Progress")
                .questions(questions.stream().map(q -> (String) q.get("question")).collect(Collectors.toList()))
                .build();
        
        MockInterview saved = mockInterviewRepository.save(interview);
        
        mlResponse.put("_id", saved.getId()); // Match frontend expectation
        return ResponseEntity.ok(mlResponse);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Object> submitMockInterview(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestBody Map<String, Object> request) {
        MockInterview interview = mockInterviewRepository.findById(id).orElseThrow();
        
        Map<String, Object> mlResponse = (Map<String, Object>) mlService.evaluateMockInterview(request);
        
        interview.setStatus("Completed");
        interview.setOverallScore((Integer) mlResponse.get("overallScore"));
        interview.setOverallFeedback((String) mlResponse.get("overallFeedback"));
        mockInterviewRepository.save(interview);
        
        return ResponseEntity.ok(mlResponse);
    }

    @PostMapping("/manual")
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
