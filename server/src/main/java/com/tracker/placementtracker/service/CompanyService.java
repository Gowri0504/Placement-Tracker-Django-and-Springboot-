package com.tracker.placementtracker.service;

import com.tracker.placementtracker.entity.Company;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    public List<Company> getCompaniesByUser(User user) {
        return companyRepository.findByUser(user);
    }

    public Company saveCompany(Company company) {
        return companyRepository.save(company);
    }

    public void deleteCompany(Long id) {
        companyRepository.deleteById(id);
    }

    public Company updateStatus(Long id, String status, Integer round) {
        Company company = companyRepository.findById(id).orElseThrow();
        company.setStatus(status);
        company.setCurrentRound(round);
        return companyRepository.save(company);
    }
}
