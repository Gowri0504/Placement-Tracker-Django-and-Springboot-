package com.tracker.placementtracker.repository;

import com.tracker.placementtracker.entity.DailyLog;
import com.tracker.placementtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DailyLogRepository extends JpaRepository<DailyLog, Long> {
    List<DailyLog> findByUser(User user);
    List<DailyLog> findByUserId(Long userId);
    List<DailyLog> findByUserAndLogDate(User user, java.time.LocalDate logDate);
}
