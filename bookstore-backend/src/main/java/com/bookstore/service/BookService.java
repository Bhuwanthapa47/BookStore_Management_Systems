package com.bookstore.service;

import com.bookstore.dto.BookDto;
import com.bookstore.exception.ResourceNotFoundException;
import com.bookstore.model.Book;
import com.bookstore.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public Page<Book> getAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable);
    }

    public Page<Book> searchBooks(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            return bookRepository.findAll(pageable);
        }
        return bookRepository.searchBooks(keyword, pageable);
    }

    public Page<Book> getBooksByGenre(String genre, Pageable pageable) {
        return bookRepository.findByGenreIgnoreCase(genre, pageable);
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    // Convert blank string to null to avoid UNIQUE constraint violation on isbn
    private String blankToNull(String value) {
        return (value == null || value.isBlank()) ? null : value;
    }

    public Book createBook(BookDto.BookRequest request) {
        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .genre(blankToNull(request.getGenre()))
                .isbn(blankToNull(request.getIsbn()))
                .price(request.getPrice())
                .description(blankToNull(request.getDescription()))
                .stockQuantity(request.getStockQuantity())
                .imageUrl(blankToNull(request.getImageUrl()))
                .build();
        return bookRepository.save(book);
    }

    public Book updateBook(Long id, BookDto.BookRequest request) {
        Book book = getBookById(id);
        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setGenre(blankToNull(request.getGenre()));
        book.setIsbn(blankToNull(request.getIsbn()));
        book.setPrice(request.getPrice());
        book.setDescription(blankToNull(request.getDescription()));
        book.setStockQuantity(request.getStockQuantity());
        book.setImageUrl(blankToNull(request.getImageUrl()));
        return bookRepository.save(book);
    }

    public void deleteBook(Long id) {
        Book book = getBookById(id);
        bookRepository.delete(book);
    }

    public BookDto.BookResponse toResponse(Book book) {
        BookDto.BookResponse response = new BookDto.BookResponse();
        response.setId(book.getId());
        response.setTitle(book.getTitle());
        response.setAuthor(book.getAuthor());
        response.setGenre(book.getGenre());
        response.setIsbn(book.getIsbn());
        response.setPrice(book.getPrice());
        response.setDescription(book.getDescription());
        response.setStockQuantity(book.getStockQuantity());
        response.setImageUrl(book.getImageUrl());
        return response;
    }
}
