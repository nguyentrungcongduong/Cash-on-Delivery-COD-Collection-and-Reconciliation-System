package com.example.backend.model;

public enum SettlementStatus {
    PENDING, // Chờ shipper nộp tiền / Chờ admin xử lý
    PAID, // Admin đã xác nhận nhận tiền từ shipper / Đã chuyển tiền cho shop
    CONFIRMED // Shop đã xác nhận nhận tiền
}
