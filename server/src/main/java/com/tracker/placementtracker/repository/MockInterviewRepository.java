package com.tracker.placementtracker.repository;

import com.tracker.placementtracker.entity.MockInterview;
import com.tracker.placementtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MockInterviewRepository extends JpaRepository<MockInterview, Long> {
    List<MockInterview> findByUser(User user);
}
