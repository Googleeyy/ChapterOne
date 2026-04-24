package com.chapterone.borrowservice.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class UserServiceClient {

    private final RestTemplate restTemplate;

    @Value("${user.service.url:http://localhost:8082}")
    private String userServiceUrl;

    public void incrementBorrowCount(String userId) {
        try {
            restTemplate.patchForObject(
                    userServiceUrl + "/api/users/" + userId + "/borrow-count",
                    Map.of("action", "increment"),
                    Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to increment user borrow count: " + e.getMessage());
        }
    }

    public void decrementBorrowCount(String userId) {
        try {
            restTemplate.patchForObject(
                    userServiceUrl + "/api/users/" + userId + "/borrow-count",
                    Map.of("action", "decrement"),
                    Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrement user borrow count: " + e.getMessage());
        }
    }
}
