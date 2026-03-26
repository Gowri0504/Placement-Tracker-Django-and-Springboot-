package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.ProblemStat;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.service.ProblemStatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemStatController {

    private final ProblemStatService problemStatService;

    @GetMapping
    public ResponseEntity<List<ProblemStat>> getStats(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(problemStatService.getStatsByUser(user));
    }

    @PostMapping
    public ResponseEntity<ProblemStat> createStat(@AuthenticationPrincipal User user, @RequestBody ProblemStat stat) {
        stat.setUser(user);
        return ResponseEntity.ok(problemStatService.saveStat(stat));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStat(@PathVariable Long id) {
        problemStatService.deleteStat(id);
        return ResponseEntity.noContent().build();
    }
}
