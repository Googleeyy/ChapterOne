package com.chapterone.bookservice.service;

import com.chapterone.bookservice.model.Book;
import com.chapterone.bookservice.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<Book> getAllBooks(String genre, String search) {
        // Treat "All" as no genre filter
        if ("All".equalsIgnoreCase(genre)) {
            genre = null;
        }

        if (genre != null && !genre.isBlank() && search != null && !search.isBlank()) {
            return bookRepository.searchByGenreAndKeyword(genre, search);
        } else if (genre != null && !genre.isBlank()) {
            return bookRepository.findByGenreIgnoreCase(genre);
        } else if (search != null && !search.isBlank()) {
            return bookRepository.searchByTitleOrAuthor(search);
        }
        return bookRepository.findAll();
    }

    public Optional<Book> getBookById(String id) {
        return bookRepository.findById(id);
    }

    public Book createBook(Book book) {
        book.setAvailableCopies(book.getTotalCopies());
        return bookRepository.save(book);
    }

    public Optional<Book> updateBook(String id, Book updatedBook) {
        return bookRepository.findById(id).map(existing -> {
            existing.setTitle(updatedBook.getTitle());
            existing.setAuthor(updatedBook.getAuthor());
            existing.setGenre(updatedBook.getGenre());
            existing.setDescription(updatedBook.getDescription());
            existing.setIsbn(updatedBook.getIsbn());
            existing.setPublishedYear(updatedBook.getPublishedYear());
            existing.setTotalCopies(updatedBook.getTotalCopies());
            return bookRepository.save(existing);
        });
    }

    public boolean deleteBook(String id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<Book> updateAvailability(String id, int delta) {
        return bookRepository.findById(id).map(book -> {
            int newAvailable = book.getAvailableCopies() + delta;
            if (newAvailable < 0 || newAvailable > book.getTotalCopies()) {
                throw new IllegalStateException("Invalid availability update: would result in " + newAvailable);
            }
            book.setAvailableCopies(newAvailable);
            return bookRepository.save(book);
        });
    }
}
