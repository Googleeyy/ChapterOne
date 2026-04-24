package com.chapterone.borrowservice.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "borrow_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRecord {

    @Id
    private String id;

    private String userId;

    private String bookId;

    private String bookTitle;

    private String bookAuthor;

    private LocalDateTime borrowDate;

    private LocalDateTime dueDate;       // borrowDate + 14 days

    private LocalDateTime returnDate;    // null if not yet returned

    private String status;               // "ACTIVE" | "RETURNED"
}
