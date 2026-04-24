package com.chapterone.borrowservice.repository;

import com.chapterone.borrowservice.model.BorrowRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRepository extends MongoRepository<BorrowRecord, String> {

    List<BorrowRecord> findByUserIdOrderByBorrowDateDesc(String userId);

    List<BorrowRecord> findByUserIdAndStatus(String userId, String status);

    Optional<BorrowRecord> findByUserIdAndBookIdAndStatus(String userId, String bookId, String status);
}
