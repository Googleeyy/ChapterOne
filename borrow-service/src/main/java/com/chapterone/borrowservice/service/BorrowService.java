package com.chapterone.borrowservice.service;

import com.chapterone.borrowservice.client.BookServiceClient;
import com.chapterone.borrowservice.client.UserServiceClient;
import com.chapterone.borrowservice.model.BorrowRecord;
import com.chapterone.borrowservice.repository.BorrowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BorrowService {

    private final BorrowRepository borrowRepository;
    private final BookServiceClient bookServiceClient;
    private final UserServiceClient userServiceClient;

    public BorrowRecord borrowBook(String userId, String bookId) {
        // Check if user already has this book active
        Optional<BorrowRecord> existing = borrowRepository.findByUserIdAndBookIdAndStatus(userId, bookId, "ACTIVE");
        if (existing.isPresent()) {
            throw new IllegalStateException("You already have this book borrowed.");
        }

        // Fetch book details from book-service
        Map<String, Object> book = bookServiceClient.getBook(bookId);
        if (book == null) {
            throw new IllegalArgumentException("Book not found: " + bookId);
        }

        int availableCopies = (int) book.get("availableCopies");
        if (availableCopies <= 0) {
            throw new IllegalStateException("No copies available for this book.");
        }

        // Decrement availability
        bookServiceClient.decrementAvailability(bookId);

        // Update user borrow count
        userServiceClient.incrementBorrowCount(userId);

        // Create borrow record
        LocalDateTime now = LocalDateTime.now();
        BorrowRecord record = BorrowRecord.builder()
                .userId(userId)
                .bookId(bookId)
                .bookTitle((String) book.get("title"))
                .bookAuthor((String) book.get("author"))
                .borrowDate(now)
                .dueDate(now.plusDays(14))
                .returnDate(null)
                .status("ACTIVE")
                .build();

        return borrowRepository.save(record);
    }

    public BorrowRecord returnBook(String borrowId) {
        BorrowRecord record = borrowRepository.findById(borrowId)
                .orElseThrow(() -> new IllegalArgumentException("Borrow record not found: " + borrowId));

        if ("RETURNED".equals(record.getStatus())) {
            throw new IllegalStateException("Book already returned.");
        }

        // Increment book availability
        bookServiceClient.incrementAvailability(record.getBookId());

        // Update user borrow count
        userServiceClient.decrementBorrowCount(record.getUserId());

        record.setStatus("RETURNED");
        record.setReturnDate(LocalDateTime.now());
        return borrowRepository.save(record);
    }

    public List<BorrowRecord> getUserHistory(String userId) {
        return borrowRepository.findByUserIdOrderByBorrowDateDesc(userId);
    }

    public List<BorrowRecord> getUserActiveborrows(String userId) {
        return borrowRepository.findByUserIdAndStatus(userId, "ACTIVE");
    }
}
