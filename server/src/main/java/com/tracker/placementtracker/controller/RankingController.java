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
        return ResponseEntity.ok(rankingService.getLeaderboard());
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
