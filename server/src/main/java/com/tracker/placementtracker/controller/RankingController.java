package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.Ranking;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rankings")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/leaderboard")
    public ResponseEntity<List<Ranking>> getLeaderboard() {
        try {
            List<Ranking> leaderboard = rankingService.getLeaderboard();
            if (leaderboard.isEmpty()) {
                // If empty, we can try to update once in the background or just return empty
                // For now, let's just return what we have to avoid 500s
                return ResponseEntity.ok(leaderboard);
            }
            return ResponseEntity.ok(leaderboard);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/leaderboard/college/{college}")
    public ResponseEntity<List<Ranking>> getCollegeLeaderboard(@PathVariable String college) {
        return ResponseEntity.ok(rankingService.getCollegeLeaderboard(college));
    }

    @GetMapping("/leaderboard/skill/{skill}")
    public ResponseEntity<List<Ranking>> getSkillLeaderboard(@PathVariable String skill) {
        return ResponseEntity.ok(rankingService.getSkillLeaderboard(skill));
    }

    @GetMapping("/my-rank")
    public ResponseEntity<Ranking> getMyRank(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(rankingService.updateUserRanking(user));
    }

    @PostMapping("/update-all")
    public ResponseEntity<Void> updateAll() {
        rankingService.updateAllRankings();
        return ResponseEntity.ok().build();
    }
}
