package com.bookstore.dto;

import com.bookstore.model.Order;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    @Data
    public static class OrderItemRequest {
        @NotNull
        private Long bookId;

        @NotNull
        @Min(1)
        private Integer quantity;
    }

    @Data
    public static class PlaceOrderRequest {
        @NotNull
        private List<OrderItemRequest> items;
    }

    @Data
    public static class UpdateStatusRequest {
        @NotNull
        private Order.OrderStatus status;
        private Order.PaymentStatus paymentStatus;
    }

    @Data
    public static class OrderItemResponse {
        private Long id;
        private Long bookId;
        private String bookTitle;
        private String bookAuthor;
        private String bookImageUrl;
        private Integer quantity;
        private BigDecimal unitPrice;
        private BigDecimal subtotal;
    }

    @Data
    public static class OrderResponse {
        private Long id;
        private Long userId;
        private String userName;
        private String userEmail;
        private List<OrderItemResponse> items;
        private BigDecimal totalAmount;
        private Order.OrderStatus status;
        private Order.PaymentStatus paymentStatus;
        private LocalDateTime createdAt;
    }
}
