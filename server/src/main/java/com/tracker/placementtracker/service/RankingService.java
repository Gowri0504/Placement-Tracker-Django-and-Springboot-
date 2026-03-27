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

    @Transactional(readOnly = true)
    @Cacheable(value = "global_leaderboard", key = "'leaderboard:global'")
    public List<Ranking> getLeaderboard() {
        return rankingRepository.findAllByOrderByPrsScoreDesc();
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "college_leaderboard", key = "'leaderboard:college:' + #college")
    public List<Ranking> getCollegeLeaderboard(String college) {
        return rankingRepository.findAllByOrderByPrsScoreDesc().stream()
                .filter(r -> r.getUser() != null && college.equalsIgnoreCase(r.getUser().getCollege()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "skill_leaderboard", key = "'leaderboard:skill:' + #skill")
    public List<Ranking> getSkillLeaderboard(String skill) {
        return rankingRepository.findAllByOrderByPrsScoreDesc().stream()
                .filter(r -> r.getUser() != null && r.getUser().getSkills() != null && r.getUser().getSkills().contains(skill))
                .collect(Collectors.toList());
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
        double prsScore = (accuracy * 30.0) + (difficulty * 25.0) + (consistency * 20.0) + (time * 15.0) + (coverage * 10.0);
        prsScore = Math.round(prsScore * 100.0) / 100.0;

        Ranking ranking = rankingRepository.findByUser(user)
                .orElse(Ranking.builder().user(user).build());
        
        ranking.setPrsScore(prsScore);
        
        Map<String, Double> breakdown = new java.util.HashMap<>();
        breakdown.put("accuracy", accuracy * 100);
        breakdown.put("difficulty", difficulty * 100);
        breakdown.put("consistency", consistency * 100);
        breakdown.put("timeEfficiency", time * 100);
        breakdown.put("coreCoverage", coverage * 100);
        
        ranking.setBreakdown(breakdown);
        Ranking saved = rankingRepository.save(ranking);
        
        // Update user's profile score
        user.setProfileScore(prsScore);
        userRepository.save(user);
        
        saved.setBreakdown(breakdown); // Restore transient field after save
        
        // Gamification: Update XP based on PRS
        updateUserXP(user, prsScore);
        
        return saved;
    }

    private void updateUserXP(User user, double prsScore) {
        // Simple XP logic: PRS * 10 + bonus for high scores
        long newXp = (long) (prsScore * 10);
        if (prsScore > 80) newXp += 500;
        if (prsScore > 90) newXp += 1000;
        
        user.setXp(newXp);
        
        // Level logic: Level = (XP / 1000) + 1
        int newLevel = (int) (newXp / 1000) + 1;
        user.setLevel(newLevel);
        
        // Badge logic
        List<String> badges = user.getBadges();
        if (badges == null) badges = new java.util.ArrayList<>();
        
        if (prsScore > 70 && !badges.contains("SQL Ninja")) badges.add("SQL Ninja");
        if (prsScore > 85 && !badges.contains("Graph Master")) badges.add("Graph Master");
        
        user.setBadges(badges);
        userRepository.save(user);
    }

    private double calculateAccuracy(List<ProblemStat> stats) {
        if (stats == null || stats.isEmpty()) return 0.0;
        long correct = stats.stream()
                .filter(s -> s != null && Boolean.TRUE.equals(s.getIsCorrect()))
                .count();
        return (double) correct / stats.size();
    }

    private double calculateAverageDifficulty(List<ProblemStat> stats) {
        if (stats == null || stats.isEmpty()) return 0.0;
        double sum = stats.stream()
                .filter(s -> s != null && s.getDifficulty() != null)
                .mapToDouble(s -> {
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
        if (logs == null || logs.isEmpty()) return 0.0;
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long activeDays = logs.stream()
                .filter(l -> l != null && l.getCreatedAt() != null && l.getCreatedAt().isAfter(thirtyDaysAgo))
                .map(l -> l.getCreatedAt().toLocalDate())
                .distinct()
                .count();
        return Math.min(1.0, (double) activeDays / 20.0); 
    }

    private double calculateTimeEfficiency(List<ProblemStat> stats) {
        if (stats == null || stats.isEmpty()) return 0.0;
        double avgTime = stats.stream()
                .filter(s -> s != null)
                .mapToInt(s -> s.getTimeTakenMinutes() != null ? s.getTimeTakenMinutes() : 45)
                .average().orElse(0.0);
        // Normalized time efficiency: assume 45 mins is "standard", 15 mins is "excellent"
        if (avgTime <= 15) return 1.0;
        if (avgTime >= 60) return 0.2;
        return 1.0 - ((avgTime - 15) / 45.0) * 0.8;
    }

    private double calculateCoverage(List<Topic> topics) {
        if (topics == null || topics.isEmpty()) return 0.0;
        double totalCompletion = topics.stream()
                .filter(t -> t != null && t.getCompletionPercentage() != null)
                .mapToDouble(Topic::getCompletionPercentage).sum();
        return totalCompletion / (topics.size() * 100.0);
    }
}
