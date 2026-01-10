package com.example.backend.dto;

public class CreateOrderRequest {
    private String receiverName;
    private String receiverPhone;
    private String receiverAddress;
    private String pickupAddress;

    public String getPickupAddress() {
        return pickupAddress;
    }

    public void setPickupAddress(String pickupAddress) {
        this.pickupAddress = pickupAddress;
    }

    private String productName;
    private Double weight;
    private Double codAmount;
    private Double shippingFee;
    private String shipperNote;
    private String allowInspection;
    private String note;
    private String shipperId;

    // Getters and Setters
    public String getShipperId() {
        return shipperId;
    }

    public void setShipperId(String shipperId) {
        this.shipperId = shipperId;
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

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
