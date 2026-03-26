package com.tracker.placementtracker.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MLService {

    private final RestTemplate restTemplate;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    public Object analyzeResume(MultipartFile file) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            body.add("resume", resource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            return restTemplate.postForObject(mlServiceUrl + "/analyze/", requestEntity, Object.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read resume file", e);
        }
    }

    public Object getSuggestions(Map<String, Object> stats) {
        return restTemplate.postForObject(mlServiceUrl + "/suggestions/", stats, Object.class);
    }

    public Object getReadinessScore(Map<String, Object> data) {
        return restTemplate.postForObject(mlServiceUrl + "/readiness-score/", data, Object.class);
    }

    public Object startMockInterview(Map<String, Object> request) {
        return restTemplate.postForObject(mlServiceUrl + "/mock-start/", request, Object.class);
    }

    public Object evaluateMockInterview(Map<String, Object> request) {
        return restTemplate.postForObject(mlServiceUrl + "/mock-evaluate/", request, Object.class);
    }
}
