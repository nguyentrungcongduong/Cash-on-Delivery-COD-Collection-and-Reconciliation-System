package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String orderCode;

    @Column(nullable = false)
    private String receiverName;

    @Column(nullable = false)
    private String receiverPhone;

    @Column(nullable = false)
    private String receiverAddress;

    @Column(nullable = false)
    private String pickupAddress;

    @Column(nullable = false)
    private String productName;

    private Double weight; // grams
    private String dimensions; // DxRxC

    @Column(nullable = false)
    private Double codAmount;

    @Column(nullable = false)
    private Double shippingFee;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private String note;
    private String shipperNote; // Cho xem hàng, không cho xem...
    private String allowInspection; // YES/NO

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private User shop;

    @ManyToOne
    @JoinColumn(name = "shipper_id")
    private User shipper;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime failedAt;
    private String failReason;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null)
            status = OrderStatus.CREATED;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverPhone() {
        return receiverPhone;
    }

    public void setReceiverPhone(String receiverPhone) {
        this.receiverPhone = receiverPhone;
    }

    public String getReceiverAddress() {
        return receiverAddress;
    }

    public void setReceiverAddress(String receiverAddress) {
        this.receiverAddress = receiverAddress;
    }

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getDimensions() {
        return dimensions;
    }

    public void setDimensions(String dimensions) {
        this.dimensions = dimensions;
    }

    public Double getCodAmount() {
        return codAmount;
    }

    public void setCodAmount(Double codAmount) {
        this.codAmount = codAmount;
    }

    public Double getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(Double shippingFee) {
        this.shippingFee = shippingFee;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public String getShipperNote() {
        return shipperNote;
    }

    public void setShipperNote(String shipperNote) {
        this.shipperNote = shipperNote;
    }

    public String getAllowInspection() {
        return allowInspection;
    }

    public void setAllowInspection(String allowInspection) {
        this.allowInspection = allowInspection;
    }

    public User getShop() {
        return shop;
    }

    public void setShop(User shop) {
        this.shop = shop;
    }

    public User getShipper() {
        return shipper;
    }

    public void setShipper(User shipper) {
        this.shipper = shipper;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    public LocalDateTime getFailedAt() {
        return failedAt;
    }

    public void setFailedAt(LocalDateTime failedAt) {
        this.failedAt = failedAt;
    }

    public String getFailReason() {
        return failReason;
    }

    public void setFailReason(String failReason) {
        this.failReason = failReason;
    }
}
