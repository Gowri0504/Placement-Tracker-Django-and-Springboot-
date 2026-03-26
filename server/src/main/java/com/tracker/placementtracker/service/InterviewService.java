package com.tracker.placementtracker.service;

import com.tracker.placementtracker.entity.Interview;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.repository.InterviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;

    public List<Interview> getInterviewsByUser(User user) {
        return interviewRepository.findByUser(user);
    }

    public Interview saveInterview(Interview interview) {
        return interviewRepository.save(interview);
    }

    public void deleteInterview(Long id) {
        interviewRepository.deleteById(id);
    }
}
