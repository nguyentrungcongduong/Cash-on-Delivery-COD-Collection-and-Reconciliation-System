package com.example.backend.model;

public enum OrderStatus {
    CREATED, // Đã tạo
    ASSIGNED, // Đã phân phối shipper
    PICKED_UP, // Đã lấy hàng
    DELIVERING, // Đang giao
    DELIVERED_SUCCESS, // Giao thành công
    DELIVERY_FAILED, // Giao thất bại
    CANCELLED, // Đã hủy
    RETURNED // Đã trả hàng
}
