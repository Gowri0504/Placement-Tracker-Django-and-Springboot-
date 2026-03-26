package com.tracker.placementtracker.service;

import com.tracker.placementtracker.entity.*;
import com.tracker.placementtracker.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RankingService {

    private final RankingRepository rankingRepository;
    private final ProblemStatRepository problemStatRepository;
    private final DailyLogRepository dailyLogRepository;
    private final TopicRepository topicRepository;
    private final UserRepository userRepository;

    @Transactional
    @CacheEvict(value = {"global_leaderboard", "college_leaderboard", "skill_leaderboard"}, allEntries = true)
    public void updateAllRankings() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            updateUserRanking(user);
        }
        
        // Update global ranks
        List<Ranking> allRankings = rankingRepository.findAllByOrderByPrsScoreDesc();
        for (int i = 0; i < allRankings.size(); i++) {
            Ranking r = allRankings.get(i);
            r.setGlobalRank(i + 1);
            rankingRepository.save(r);
        }
    }

    @Transactional
    @CacheEvict(value = {"global_leaderboard", "college_leaderboard", "skill_leaderboard"}, allEntries = true)
    public Ranking updateUserRanking(User user) {
        List<ProblemStat> stats = problemStatRepository.findByUser(user);
        List<DailyLog> logs = dailyLogRepository.findByUser(user);
        List<Topic> topics = topicRepository.findByUser(user);

        double accuracy = calculateAccuracy(stats);
        double difficulty = calculateAverageDifficulty(stats);
        double consistency = calculateConsistency(logs);
        double time = calculateTimeEfficiency(stats);
        double coverage = calculateCoverage(topics);

        // PRS = (Accuracy * 0.3) + (Difficulty * 0.25) + (Consistency * 0.2) + (Time * 0.15) + (Coverage * 0.1)
        double prsScore = (accuracy * 0.3) + (difficulty * 0.25) + (consistency * 0.2) + (time * 0.15) + (coverage * 0.1);
        prsScore = Math.round(prsScore * 100.0) / 100.0;

        Ranking ranking = rankingRepository.findByUser(user)
                .orElse(Ranking.builder().user(user).build());
        
        ranking.setPrsScore(prsScore);
        Ranking saved = rankingRepository.save(ranking);
        
        // Update user's profile score
        user.setProfileScore(prsScore);
        userRepository.save(user);
        
        return saved;
    }

    private double calculateAccuracy(List<ProblemStat> stats) {
        if (stats.isEmpty()) return 0.0;
        long correct = stats.stream().filter(ProblemStat::getIsCorrect).count();
        return (double) correct / stats.size();
    }

    private double calculateAverageDifficulty(List<ProblemStat> stats) {
        if (stats.isEmpty()) return 0.0;
        double sum = stats.stream().mapToDouble(s -> {
            switch (s.getDifficulty().toUpperCase()) {
                case "HARD": return 1.0;
                case "MEDIUM": return 0.6;
                case "EASY": return 0.3;
                default: return 0.0;
            }
        }).sum();
        return sum / stats.size();
    }

    private double calculateConsistency(List<DailyLog> logs) {
        if (logs.isEmpty()) return 0.0;
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long activeDays = logs.stream()
                .filter(l -> l.getCreatedAt().isAfter(thirtyDaysAgo))
                .map(l -> l.getCreatedAt().toLocalDate())
                .distinct()
                .count();
        return Math.min(1.0, (double) activeDays / 20.0); // 20 days/month as max consistency
    }

    private double calculateTimeEfficiency(List<ProblemStat> stats) {
        if (stats.isEmpty()) return 0.0;
        double avgTime = stats.stream().mapToInt(ProblemStat::getTimeTakenMinutes).average().orElse(0.0);
        // Normalized time efficiency: assume 45 mins is "standard", 15 mins is "excellent"
        if (avgTime <= 15) return 1.0;
        if (avgTime >= 60) return 0.2;
        return 1.0 - ((avgTime - 15) / 45.0) * 0.8;
    }

    private double calculateCoverage(List<Topic> topics) {
        if (topics.isEmpty()) return 0.0;
        double totalCompletion = topics.stream().mapToDouble(Topic::getCompletionPercentage).sum();
        return totalCompletion / (topics.size() * 100.0);
    }

    @Cacheable(value = "global_leaderboard", key = "'leaderboard:global'")
    public List<Ranking> getLeaderboard() {
        return rankingRepository.findAllByOrderByPrsScoreDesc();
    }

    @Cacheable(value = "college_leaderboard", key = "'leaderboard:college:' + #college")
    public List<Ranking> getCollegeLeaderboard(String college) {
        return rankingRepository.findAllByOrderByPrsScoreDesc().stream()
                .filter(r -> college.equalsIgnoreCase(r.getUser().getCollege()))
                .collect(Collectors.toList());
    }

    @Cacheable(value = "skill_leaderboard", key = "'leaderboard:skill:' + #skill")
    public List<Ranking> getSkillLeaderboard(String skill) {
        return rankingRepository.findAllByOrderByPrsScoreDesc().stream()
                .filter(r -> r.getUser().getSkills() != null && r.getUser().getSkills().contains(skill))
                .collect(Collectors.toList());
    }
}
