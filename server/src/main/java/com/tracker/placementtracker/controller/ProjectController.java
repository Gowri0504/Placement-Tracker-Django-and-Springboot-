package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.Project;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectRepository projectRepository;

    @GetMapping
    public ResponseEntity<List<Project>> getProjects(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(projectRepository.findByUser(user));
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@AuthenticationPrincipal User user, @RequestBody Project project) {
        project.setUser(user);
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@AuthenticationPrincipal User user, @PathVariable Long id, @RequestBody Project projectDetails) {
        Project project = projectRepository.findById(id).orElseThrow();
        if (!project.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        project.setTitle(projectDetails.getTitle());
        project.setDescription(projectDetails.getDescription());
        project.setTechStack(projectDetails.getTechStack());
        project.setGithubLink(projectDetails.getGithubLink());
        project.setLiveLink(projectDetails.getLiveLink());
        project.setConfidenceScore(projectDetails.getConfidenceScore());
        return ResponseEntity.ok(projectRepository.save(project));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@AuthenticationPrincipal User user, @PathVariable Long id) {
        Project project = projectRepository.findById(id).orElseThrow();
        if (!project.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        projectRepository.delete(project);
        return ResponseEntity.noContent().build();
    }
}