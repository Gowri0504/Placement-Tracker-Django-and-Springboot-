package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.ProblemStat;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.service.ProblemStatService;
import com.tracker.placementtracker.service.TopicService;
import com.tracker.placementtracker.service.MLService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final ProblemStatService problemStatService;
    private final TopicService topicService;
    private final MLService mlService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAnalytics(@AuthenticationPrincipal User user) {
        List<ProblemStat> stats = problemStatService.getStatsByUser(user);
        
        // Heatmap Data (Count problems per day)
        Map<LocalDate, Long> heatmap = stats.stream()
                .collect(Collectors.groupingBy(s -> s.getSolvedAt().toLocalDate(), Collectors.counting()));
        
        List<Map<String, Object>> heatmapData = heatmap.entrySet().stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", e.getKey().toString());
                    map.put("count", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());

        // Accuracy Trends
        Map<String, Double> accuracyByDifficulty = stats.stream()
                .collect(Collectors.groupingBy(ProblemStat::getDifficulty,
                        Collectors.averagingDouble(s -> s.getIsCorrect() ? 100.0 : 0.0)));

        Map<String, Object> response = new HashMap<>();
        response.put("difficultyCounts", getDifficultyCounts(stats));
        response.put("totalSolved", stats.size());
        response.put("heatmap", heatmapData);
        response.put("accuracyTrends", accuracyByDifficulty);
        
        // Mock skills data based on topics
        List<Map<String, Object>> skillsData = topicService.getTopicsByUser(user).stream()
                .map(t -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("subject", t.getName());
                    map.put("A", t.getCompletionPercentage());
                    map.put("fullMark", 100);
                    return map;
                })
                .collect(Collectors.toList());
        
        response.put("skillsData", skillsData);
        
        // ML Insights (Weak Topics & Suggestions)
        Map<String, Object> mlRequest = new HashMap<>();
        mlRequest.put("stats", Map.of("weak_topics", getWeakTopics(user)));
        try {
            response.put("mlInsights", mlService.getSuggestions(mlRequest));
        } catch (Exception e) {
            response.put("mlInsights", Map.of("suggestions", Collections.singletonList("Keep practicing to get more insights!")));
        }
        
        return ResponseEntity.ok(response);
    }

    private List<Map<String, Object>> getDifficultyCounts(List<ProblemStat> stats) {
        Map<String, Long> counts = stats.stream()
                .collect(Collectors.groupingBy(ProblemStat::getDifficulty, Collectors.counting()));
        
        return counts.entrySet().stream()
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("_id", e.getKey());
                    map.put("count", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }

    private List<String> getWeakTopics(User user) {
        // Logic to detect topics with low accuracy
        return topicService.getTopicsByUser(user).stream()
                .filter(t -> t.getCompletionPercentage() < 40)
                .map(t -> t.getName())
                .collect(Collectors.toList());
    }
}
