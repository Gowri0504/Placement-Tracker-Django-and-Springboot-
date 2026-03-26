package com.tracker.placementtracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "topics")
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // DSA, OS, DBMS, CN, OOP

    private String subCategory;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Double completionPercentage = 0.0;
    
    private Integer totalSubtopics = 0;
    private Integer completedSubtopics = 0;
}
