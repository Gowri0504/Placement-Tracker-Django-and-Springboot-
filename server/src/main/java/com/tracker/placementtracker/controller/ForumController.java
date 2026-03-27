package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.ForumPost;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.repository.ForumPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {

    private final ForumPostRepository forumPostRepository;

    @GetMapping("/posts")
    public ResponseEntity<List<ForumPost>> getPosts(@RequestParam(required = false) String category) {
        if (category == null || category.equalsIgnoreCase("All")) {
            return ResponseEntity.ok(forumPostRepository.findAllByOrderByCreatedAtDesc());
        }
        return ResponseEntity.ok(forumPostRepository.findByCategoryOrderByCreatedAtDesc(category));
    }

    @PostMapping("/posts")
    public ResponseEntity<ForumPost> createPost(@AuthenticationPrincipal User user, @RequestBody ForumPost post) {
        post.setAuthor(user);
        post.setUpvotes(0);
        return ResponseEntity.ok(forumPostRepository.save(post));
    }

    @PostMapping("/posts/{id}/upvote")
    public ResponseEntity<ForumPost> upvote(@PathVariable Long id) {
        ForumPost post = forumPostRepository.findById(id).orElseThrow();
        post.setUpvotes(post.getUpvotes() + 1);
        return ResponseEntity.ok(forumPostRepository.save(post));
    }
}