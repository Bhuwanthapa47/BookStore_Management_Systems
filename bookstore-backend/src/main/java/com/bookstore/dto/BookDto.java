package com.bookstore.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

public class BookDto {

    @Data
    public static class BookRequest {
        @NotBlank
        private String title;

        @NotBlank
        private String author;

        private String genre;
        private String isbn;

        @NotNull
        @DecimalMin("0.0")
        private BigDecimal price;

        private String description;

        @Min(0)
        @NotNull
        private Integer stockQuantity;

        private String imageUrl;
    }

    @Data
    public static class BookResponse {
        private Long id;
        private String title;
        private String author;
        private String genre;
        private String isbn;
        private BigDecimal price;
        private String description;
        private Integer stockQuantity;
        private String imageUrl;
    }
}
