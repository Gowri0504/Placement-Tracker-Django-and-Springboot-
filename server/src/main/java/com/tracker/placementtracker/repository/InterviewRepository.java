package com.tracker.placementtracker.repository;

import com.tracker.placementtracker.entity.Interview;
import com.tracker.placementtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByUser(User user);
    List<Interview> findByUserId(Long userId);
}
