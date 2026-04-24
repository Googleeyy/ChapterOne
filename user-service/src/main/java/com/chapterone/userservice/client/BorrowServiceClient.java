package com.chapterone.userservice.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class BorrowServiceClient {

    private final RestTemplate restTemplate;

    @Value("${borrow.service.url:http://localhost:8083}")
    private String borrowServiceUrl;

    public List<Map<String, Object>> getUserBorrows(String userId) {
        try {
            ResponseEntity<List> response = restTemplate.getForEntity(
                    borrowServiceUrl + "/api/borrows/user/" + userId, List.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
            return Collections.emptyList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
