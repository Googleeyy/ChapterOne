package com.chapterone.userservice.service;

import com.chapterone.userservice.client.BorrowServiceClient;
import com.chapterone.userservice.model.User;
import com.chapterone.userservice.repository.UserRepository;
import com.chapterone.userservice.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final BorrowServiceClient borrowServiceClient;

    public User register(String username, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use: " + email);
        }
        User user = User.builder()
                .username(username)
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .createdAt(LocalDateTime.now())
                .totalBorrowed(0)
                .currentlyBorrowing(0)
                .build();
        return userRepository.save(user);
    }

    public Map<String, Object> login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Calculate stats dynamically
        List<Map<String, Object>> borrows = borrowServiceClient.getUserBorrows(user.getId());
        long totalBorrowed = borrows.size();
        long currentlyBorrowing = borrows.stream()
                .filter(b -> "ACTIVE".equals(b.get("status")))
                .count();

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getUsername());
        return Map.of(
                "token", token,
                "user", Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "totalBorrowed", totalBorrowed,
                        "currentlyBorrowing", currentlyBorrowing,
                        "daysPerLoan", user.getDaysPerLoan(),
                        "createdAt", user.getCreatedAt().toString()
                )
        );
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id).map(user -> {
            // Calculate stats dynamically
            List<Map<String, Object>> borrows = borrowServiceClient.getUserBorrows(user.getId());
            user.setTotalBorrowed((int) borrows.size());
            user.setCurrentlyBorrowing((int) borrows.stream()
                    .filter(b -> "ACTIVE".equals(b.get("status")))
                    .count());
            return user;
        });
    }

    public Optional<User> updateProfile(String id, String username) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(username);
            return userRepository.save(user);
        });
    }

    public Optional<User> incrementBorrowCount(String userId) {
        return userRepository.findById(userId).map(user -> {
            user.setTotalBorrowed(user.getTotalBorrowed() + 1);
            user.setCurrentlyBorrowing(user.getCurrentlyBorrowing() + 1);
            return userRepository.save(user);
        });
    }

    public Optional<User> decrementCurrentBorrowing(String userId) {
        return userRepository.findById(userId).map(user -> {
            user.setCurrentlyBorrowing(Math.max(0, user.getCurrentlyBorrowing() - 1));
            return userRepository.save(user);
        });
    }
}
