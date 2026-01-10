package com.example.backend.model;

public enum LedgerType {
    COD_COLLECTED, // Shipper thu hộ (Tiền cộng vào nợ của Shipper)
    SHIPPING_FEE, // Phí vận chuyển (Tiền trừ vào nợ của Shipper/tiền Shop nhận)
    SETTLEMENT_PAYMENT // Thanh toán đối soát (Shipper nộp tiền/Admin trả tiền)
}
