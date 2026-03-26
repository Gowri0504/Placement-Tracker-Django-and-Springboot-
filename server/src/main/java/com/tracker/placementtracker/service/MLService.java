package com.tracker.placementtracker.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class MLService {

    private final RestTemplate restTemplate;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    public Object analyzeResume(MultipartFile file) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("resume", file.getResource());

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        return restTemplate.postForObject(mlServiceUrl + "/ml/analyze-resume", requestEntity, Object.class);
    }

    public Object getSuggestions(Map<String, Object> stats) {
        return restTemplate.postForObject(mlServiceUrl + "/ml/suggestions", stats, Object.class);
    }

    public Object getReadinessScore(Map<String, Object> data) {
        return restTemplate.postForObject(mlServiceUrl + "/ml/readiness-score", data, Object.class);
    }
}
