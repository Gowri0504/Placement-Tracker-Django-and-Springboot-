package com.tracker.placementtracker.repository;

import com.tracker.placementtracker.entity.Company;
import com.tracker.placementtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findByUser(User user);
    List<Company> findByUserId(Long userId);
}
