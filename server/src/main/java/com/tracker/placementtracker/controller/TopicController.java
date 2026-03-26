package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.Topic;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @GetMapping
    public ResponseEntity<List<Topic>> getTopics(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(topicService.getTopicsByUser(user));
    }

    @PostMapping
    public ResponseEntity<Topic> createTopic(@AuthenticationPrincipal User user, @RequestBody Topic topic) {
        topic.setUser(user);
        return ResponseEntity.ok(topicService.saveTopic(topic));
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<Topic> updateProgress(@PathVariable Long id, @RequestBody Integer completedSubtopics) {
        return ResponseEntity.ok(topicService.updateProgress(id, completedSubtopics));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable Long id) {
        topicService.deleteTopic(id);
        return ResponseEntity.noContent().build();
    }
}
