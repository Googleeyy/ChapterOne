package com.chapterone.borrowservice.client;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class BookServiceClient {

    private final RestTemplate restTemplate;

    @Value("${book.service.url:http://localhost:8081}")
    private String bookServiceUrl;

    public Map<String, Object> getBook(String bookId) {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(
                    bookServiceUrl + "/api/books/" + bookId, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
            return null;
        } catch (Exception e) {
            throw new RuntimeException("Book service unavailable: " + e.getMessage());
        }
    }

    public void decrementAvailability(String bookId) {
        try {
            restTemplate.patchForObject(
                    bookServiceUrl + "/api/books/" + bookId + "/availability",
                    Map.of("delta", -1),
                    Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to decrement book availability: " + e.getMessage());
        }
    }

    public void incrementAvailability(String bookId) {
        try {
            restTemplate.patchForObject(
                    bookServiceUrl + "/api/books/" + bookId + "/availability",
                    Map.of("delta", 1),
                    Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to increment book availability: " + e.getMessage());
        }
    }
}
