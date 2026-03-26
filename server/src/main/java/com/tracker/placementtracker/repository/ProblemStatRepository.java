package com.tracker.placementtracker.repository;

import com.tracker.placementtracker.entity.ProblemStat;
import com.tracker.placementtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProblemStatRepository extends JpaRepository<ProblemStat, Long> {
    List<ProblemStat> findByUser(User user);
    List<ProblemStat> findByUserId(Long userId);
}
