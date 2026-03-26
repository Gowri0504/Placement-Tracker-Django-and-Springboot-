package com.tracker.placementtracker.service;

import com.tracker.placementtracker.entity.Topic;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicRepository topicRepository;

    public List<Topic> getTopicsByUser(User user) {
        return topicRepository.findByUser(user);
    }

    public Topic saveTopic(Topic topic) {
        if (topic.getTotalSubtopics() > 0) {
            topic.setCompletionPercentage((double) topic.getCompletedSubtopics() / topic.getTotalSubtopics() * 100);
        }
        return topicRepository.save(topic);
    }

    public void deleteTopic(Long id) {
        topicRepository.deleteById(id);
    }

    public Topic updateProgress(Long id, Integer completedSubtopics) {
        Topic topic = topicRepository.findById(id).orElseThrow();
        topic.setCompletedSubtopics(completedSubtopics);
        if (topic.getTotalSubtopics() > 0) {
            topic.setCompletionPercentage((double) completedSubtopics / topic.getTotalSubtopics() * 100);
        }
        return topicRepository.save(topic);
    }
}
