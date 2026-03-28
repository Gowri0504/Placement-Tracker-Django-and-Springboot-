package com.tracker.placementtracker.service;

import com.tracker.placementtracker.entity.Progress;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.repository.ProgressRepository;
import com.tracker.placementtracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;

    public List<Progress> getProgressByUser(Long userId) {
        return progressRepository.findByUserIdOrderByDateDesc(userId);
    }

    @Transactional
    public Progress saveProgress(User user, Progress progressRequest) {
        Progress progress = progressRepository.findByUserAndDate(user, progressRequest.getDate())
                .orElse(Progress.builder()
                        .user(user)
                        .date(progressRequest.getDate())
                        .build());

        progress.setAptitude(progressRequest.isAptitude());
        progress.setDsa(progressRequest.isDsa());
        progress.setCore(progressRequest.isCore());
        progress.setProject(progressRequest.isProject());
        progress.setTest(progressRequest.isTest());
        progress.setInterview(progressRequest.isInterview());
        progress.setTopics(progressRequest.getTopics());

        Progress saved = progressRepository.save(progress);
        
        // Update user XP and Level
        updateUserStats(user);
        
        return saved;
    }

    private void updateUserStats(User user) {
        List<Progress> allProgress = progressRepository.findByUserOrderByDateDesc(user);
        
        // XP = number of completed tasks (checkboxes)
        long xp = 0;
        for (Progress p : allProgress) {
            if (p.isAptitude()) xp++;
            if (p.isDsa()) xp++;
            if (p.isCore()) xp++;
            if (p.isProject()) xp++;
            if (p.isTest()) xp++;
            if (p.isInterview()) xp++;
        }
        
        user.setXp(xp);
        
        // Level = XP / 50
        user.setLevel((int) (xp / 50) + 1);
        
        // Streak = consecutive active days (at least one checkbox checked)
        int streak = calculateStreak(allProgress);
        user.setStreak(streak);
        
        userRepository.save(user);
    }

    private int calculateStreak(List<Progress> progressList) {
        if (progressList == null || progressList.isEmpty()) return 0;
        
        int streak = 0;
        LocalDate today = LocalDate.now();
        LocalDate lastDate = null;
        
        // Filter progress with at least one task done
        List<Progress> activeDays = progressList.stream()
             .filter(p -> p.isAptitude() || p.isDsa() || p.isCore() || p.isProject() || p.isTest() || p.isInterview())
             .sorted((a, b) -> b.getDate().compareTo(a.getDate())) // Descending
             .toList();

        if (activeDays.isEmpty()) return 0;

        // Check if latest active day is today or yesterday
        LocalDate latest = activeDays.get(0).getDate();
        if (!latest.isEqual(today) && !latest.isEqual(today.minusDays(1))) {
            return 0;
        }

        for (Progress p : activeDays) {
            if (lastDate == null) {
                streak = 1;
            } else {
                if (p.getDate().isEqual(lastDate.minusDays(1))) {
                    streak++;
                } else if (p.getDate().isEqual(lastDate)) {
                    // Same day, ignore
                    continue;
                } else {
                    break;
                }
            }
            lastDate = p.getDate();
        }
        
        return streak;
    }
}
