package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.DailyLog;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.service.DailyLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class DailyLogController {

    private final DailyLogService dailyLogService;

    @GetMapping
    public ResponseEntity<List<DailyLog>> getLogs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(dailyLogService.getLogsByUser(user));
    }

    @PostMapping
    public ResponseEntity<DailyLog> createLog(@AuthenticationPrincipal User user, @RequestBody DailyLog log) {
        log.setUser(user);
        return ResponseEntity.ok(dailyLogService.saveLog(log));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLog(@AuthenticationPrincipal User user, @PathVariable Long id) {
        dailyLogService.deleteLog(id, user);
        return ResponseEntity.noContent().build();
    }
}
