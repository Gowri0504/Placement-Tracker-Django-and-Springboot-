package com.tracker.placementtracker.service;

import com.tracker.placementtracker.entity.ProblemStat;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.repository.ProblemStatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemStatService {

    private final ProblemStatRepository problemStatRepository;
    private final RankingService rankingService;

    public List<ProblemStat> getStatsByUser(User user) {
        return problemStatRepository.findByUser(user);
    }

    public ProblemStat saveStat(ProblemStat stat) {
        ProblemStat saved = problemStatRepository.save(stat);
        rankingService.updateUserRanking(stat.getUser());
        return saved;
    }

    public void deleteStat(Long id, User user) {
        ProblemStat stat = problemStatRepository.findById(id).orElseThrow();
        if (!stat.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this stat");
        }
        problemStatRepository.deleteById(id);
        rankingService.updateUserRanking(stat.getUser());
    }
}
