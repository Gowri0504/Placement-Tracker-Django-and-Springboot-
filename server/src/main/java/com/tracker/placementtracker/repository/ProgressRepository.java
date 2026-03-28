package com.tracker.placementtracker.repository;

import com.tracker.placementtracker.entity.Progress;
import com.tracker.placementtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUserOrderByDateDesc(User user);
    List<Progress> findByUserIdOrderByDateDesc(Long userId);
    Optional<Progress> findByUserAndDate(User user, LocalDate date);
}
