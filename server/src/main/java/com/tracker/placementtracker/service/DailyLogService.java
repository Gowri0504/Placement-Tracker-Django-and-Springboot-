package com.tracker.placementtracker.service;

import com.tracker.placementtracker.entity.DailyLog;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.repository.DailyLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyLogService {

    private final DailyLogRepository dailyLogRepository;
    private final RankingService rankingService;

    public List<DailyLog> getLogsByUser(User user) {
        return dailyLogRepository.findByUser(user);
    }

    public List<DailyLog> getLogsByDate(User user, java.time.LocalDate date) {
        return dailyLogRepository.findByUserAndLogDate(user, date);
    }

    public DailyLog saveLog(DailyLog log) {
        DailyLog saved = dailyLogRepository.save(log);
        rankingService.updateUserRanking(log.getUser());
        return saved;
    }

    public List<DailyLog> saveAll(List<DailyLog> logs) {
        List<DailyLog> saved = dailyLogRepository.saveAll(logs);
        if (!logs.isEmpty()) {
            rankingService.updateUserRanking(logs.get(0).getUser());
        }
        return saved;
    }

    public void deleteLog(Long id, User user) {
        DailyLog log = dailyLogRepository.findById(id).orElseThrow();
        if (!log.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this log");
        }
        dailyLogRepository.deleteById(id);
        rankingService.updateUserRanking(log.getUser());
    }
}
