package com.chapterone.userservice.controller;

import com.chapterone.userservice.model.User;
import com.chapterone.userservice.service.UserService;
import com.chapterone.userservice.util.JwtUtil;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            User user = userService.register(req.getUsername(), req.getEmail(), req.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "createdAt", user.getCreatedAt().toString()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        try {
            Map<String, Object> result = userService.login(req.getEmail(), req.getPassword());
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String authHeader) {
        String userId = extractUserId(authHeader);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        return userService.getUserById(userId)
                .map(u -> ResponseEntity.ok(Map.of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "email", u.getEmail(),
                        "totalBorrowed", u.getTotalBorrowed(),
                        "currentlyBorrowing", u.getCurrentlyBorrowing(),
                        "daysPerLoan", u.getDaysPerLoan(),
                        "createdAt", u.getCreatedAt().toString()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestHeader("Authorization") String authHeader,
                                            @RequestBody Map<String, String> payload) {
        String userId = extractUserId(authHeader);
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid token"));
        String newUsername = payload.get("username");
        if (newUsername == null || newUsername.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username is required"));
        }
        return userService.updateProfile(userId, newUsername)
                .map(u -> ResponseEntity.ok(Map.of(
                        "id", u.getId(),
                        "username", u.getUsername(),
                        "email", u.getEmail(),
                        "totalBorrowed", u.getTotalBorrowed(),
                        "currentlyBorrowing", u.getCurrentlyBorrowing(),
                        "daysPerLoan", u.getDaysPerLoan()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    // Internal endpoint called by borrow-service
    @PatchMapping("/{id}/borrow-count")
    public ResponseEntity<?> updateBorrowCount(@PathVariable String id,
                                                @RequestBody Map<String, String> payload) {
        String action = payload.getOrDefault("action", "");
        if ("increment".equals(action)) {
            return userService.incrementBorrowCount(id)
                    .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        } else if ("decrement".equals(action)) {
            return userService.decrementCurrentBorrowing(id)
                    .map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Unknown action"));
    }

    private String extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        if (!jwtUtil.isTokenValid(token)) return null;
        return jwtUtil.extractUserId(token);
    }

    @Data
    static class RegisterRequest {
        @NotBlank private String username;
        @Email @NotBlank private String email;
        @NotBlank private String password;
    }

    @Data
    static class LoginRequest {
        @Email @NotBlank private String email;
        @NotBlank private String password;
    }
}
