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
@RequestMapping("/api")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/leaderboard")
    public ResponseEntity<List<User>> getLeaderboard() {
        return ResponseEntity.ok(rankingService.getLeaderboardUsers());
    }
}
