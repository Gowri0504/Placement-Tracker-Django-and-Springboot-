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
@Table(name = "daily_logs")
public class DailyLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String topic;

    private String interviewRoundName; // Aptitude, Coding, Technical, HR
    private String optionalTestTopic; // Mock Test, Company Specific, etc.
    private java.time.LocalDate logDate; // The date this log is for

    @Column(nullable = false)
    private Integer timeSpentMinutes;

    @Column(nullable = false)
    private String difficulty; // Easy, Medium, Hard

    private String notes;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
