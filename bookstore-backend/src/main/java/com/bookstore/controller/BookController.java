package com.bookstore.controller;

import com.bookstore.dto.BookDto;
import com.bookstore.model.Book;
import com.bookstore.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "Book management endpoints")
public class BookController {

    private final BookService bookService;

    @GetMapping
    @Operation(summary = "Get all books with pagination and optional search/filter")
    public ResponseEntity<Page<BookDto.BookResponse>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String genre) {

        Sort sort = sortDir.equalsIgnoreCase("desc")
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Book> books;
        if (search != null && !search.isBlank()) {
            books = bookService.searchBooks(search, pageable);
        } else if (genre != null && !genre.isBlank()) {
            books = bookService.getBooksByGenre(genre, pageable);
        } else {
            books = bookService.getAllBooks(pageable);
        }

        return ResponseEntity.ok(books.map(bookService::toResponse));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a book by ID")
    public ResponseEntity<BookDto.BookResponse> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.toResponse(bookService.getBookById(id)));
    }

    @PostMapping
    @Operation(summary = "Add a new book (Admin only)", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<BookDto.BookResponse> createBook(@Valid @RequestBody BookDto.BookRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookService.toResponse(bookService.createBook(request)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a book (Admin only)", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<BookDto.BookResponse> updateBook(@PathVariable Long id,
            @Valid @RequestBody BookDto.BookRequest request) {
        return ResponseEntity.ok(bookService.toResponse(bookService.updateBook(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a book (Admin only)", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }
}
