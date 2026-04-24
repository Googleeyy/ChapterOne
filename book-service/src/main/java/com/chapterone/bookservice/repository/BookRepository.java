package com.chapterone.bookservice.repository;

import com.chapterone.bookservice.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {

    List<Book> findByGenreIgnoreCase(String genre);

    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'author': { $regex: ?0, $options: 'i' } } ] }")
    List<Book> searchByTitleOrAuthor(String keyword);

    @Query("{ 'genre': { $regex: ?0, $options: 'i' }, $or: [ { 'title': { $regex: ?1, $options: 'i' } }, { 'author': { $regex: ?1, $options: 'i' } } ] }")
    List<Book> searchByGenreAndKeyword(String genre, String keyword);
}
