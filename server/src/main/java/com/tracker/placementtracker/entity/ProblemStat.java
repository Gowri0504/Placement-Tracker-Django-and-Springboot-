package com.tracker.placementtracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "problem_stats")
public class ProblemStat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    private String link;

    @Column(nullable = false)
    private String platform; // LeetCode, Codeforces, etc.

    @Column(nullable = false)
    private String difficulty; // Easy, Medium, Hard

    @Column(nullable = false)
    private Boolean isCorrect;

    @Column(nullable = false)
    private Integer timeTakenMinutes;

    private LocalDateTime solvedAt;

    @PrePersist
    protected void onCreate() {
        solvedAt = LocalDateTime.now();
    }
}
