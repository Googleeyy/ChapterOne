package com.chapterone.borrowservice.controller;

import com.chapterone.borrowservice.model.BorrowRecord;
import com.chapterone.borrowservice.service.BorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrows")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping
    public ResponseEntity<?> borrowBook(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String bookId = payload.get("bookId");
        if (userId == null || bookId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "userId and bookId are required"));
        }
        try {
            BorrowRecord record = borrowService.borrowBook(userId, bookId);
            return ResponseEntity.status(HttpStatus.CREATED).body(record);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/return")
    public ResponseEntity<?> returnBook(@RequestBody Map<String, String> payload) {
        String borrowId = payload.get("borrowId");
        if (borrowId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "borrowId is required"));
        }
        try {
            BorrowRecord record = borrowService.returnBook(borrowId);
            return ResponseEntity.ok(record);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BorrowRecord>> getUserHistory(@PathVariable String userId) {
        return ResponseEntity.ok(borrowService.getUserHistory(userId));
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<BorrowRecord>> getUserActiveborrows(@PathVariable String userId) {
        return ResponseEntity.ok(borrowService.getUserActiveborrows(userId));
    }
}
