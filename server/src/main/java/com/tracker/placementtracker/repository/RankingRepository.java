package com.tracker.placementtracker.repository;

import com.tracker.placementtracker.entity.Ranking;
import com.tracker.placementtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface RankingRepository extends JpaRepository<Ranking, Long> {
    Optional<Ranking> findByUser(User user);
    Optional<Ranking> findByUserId(Long userId);
    List<Ranking> findAllByOrderByPrsScoreDesc();
}
