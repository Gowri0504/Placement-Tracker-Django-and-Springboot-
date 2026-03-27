package com.tracker.placementtracker.repository;

import com.tracker.placementtracker.entity.Topic;
import com.tracker.placementtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    List<Topic> findByUser(User user);
    List<Topic> findByUserId(Long userId);
    java.util.Optional<Topic> findByUserAndName(User user, String name);
}
