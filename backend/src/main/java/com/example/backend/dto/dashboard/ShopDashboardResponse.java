package com.example.backend.dto.dashboard;

public class ShopDashboardResponse {
    private long totalOrders;
    private double totalCodAmount;
    private double collectedAmount;
    private double pendingAmount;
    private double failedAmount;
    private double shipperDebt;
    private double successRate;
    private int todayOrders;
    private double todayRevenue;
    private double pendingReceivable;
    private int overdueSettlements;

    private double pendingPayable;

    public ShopDashboardResponse() {
    }

    public double getPendingPayable() {
        return pendingPayable;
    }

    public void setPendingPayable(double pendingPayable) {
        this.pendingPayable = pendingPayable;
    }

    public ShopDashboardResponse(double totalCodAmount, double collectedAmount, int pendingOrders, double shipperDebt) {
        this.totalCodAmount = totalCodAmount;
        this.collectedAmount = collectedAmount;
        this.shipperDebt = shipperDebt;
    }

    // Getters and Setters
    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public double getTotalCodAmount() {
        return totalCodAmount;
    }

    public void setTotalCodAmount(double totalCodAmount) {
        this.totalCodAmount = totalCodAmount;
    }

    public double getCollectedAmount() {
        return collectedAmount;
    }

    public void setCollectedAmount(double collectedAmount) {
        this.collectedAmount = collectedAmount;
    }

    public double getPendingAmount() {
        return pendingAmount;
    }

    public void setPendingAmount(double pendingAmount) {
        this.pendingAmount = pendingAmount;
    }

    public double getFailedAmount() {
        return failedAmount;
    }

    public void setFailedAmount(double failedAmount) {
        this.failedAmount = failedAmount;
    }

    public double getShipperDebt() {
        return shipperDebt;
    }

    public void setShipperDebt(double shipperDebt) {
        this.shipperDebt = shipperDebt;
    }

    public double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(double successRate) {
        this.successRate = successRate;
    }

    public int getTodayOrders() {
        return todayOrders;
    }

    public void setTodayOrders(int todayOrders) {
        this.todayOrders = todayOrders;
    }

    public double getTodayRevenue() {
        return todayRevenue;
    }

    public void setTodayRevenue(double todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public double getPendingReceivable() {
        return pendingReceivable;
    }

    public void setPendingReceivable(double pendingReceivable) {
        this.pendingReceivable = pendingReceivable;
    }

    public int getOverdueSettlements() {
        return overdueSettlements;
    }

    public void setOverdueSettlements(int overdueSettlements) {
        this.overdueSettlements = overdueSettlements;
    }
}
