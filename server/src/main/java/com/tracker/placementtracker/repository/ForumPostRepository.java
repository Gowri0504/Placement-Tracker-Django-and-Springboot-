package com.tracker.placementtracker.repository;

import com.tracker.placementtracker.entity.ForumPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ForumPostRepository extends JpaRepository<ForumPost, Long> {
    List<ForumPost> findAllByOrderByCreatedAtDesc();
    List<ForumPost> findByCategoryOrderByCreatedAtDesc(String category);
}