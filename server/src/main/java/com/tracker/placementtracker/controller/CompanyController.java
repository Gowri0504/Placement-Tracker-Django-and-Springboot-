package com.tracker.placementtracker.controller;

import com.tracker.placementtracker.entity.Company;
import com.tracker.placementtracker.entity.User;
import com.tracker.placementtracker.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    @GetMapping
    public ResponseEntity<List<Company>> getCompanies(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(companyService.getCompaniesByUser(user));
    }

    @PostMapping
    public ResponseEntity<Company> createCompany(@AuthenticationPrincipal User user, @RequestBody Company company) {
        company.setUser(user);
        return ResponseEntity.ok(companyService.saveCompany(company));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Company> updateStatus(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        String status = (String) body.get("status");
        Integer round = (Integer) body.get("round");
        return ResponseEntity.ok(companyService.updateStatus(id, status, round));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}
