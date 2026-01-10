package com.example.backend.dto.dashboard;

public class AdminDashboardResponse {
    private long totalShops;
    private long totalShippers;
    private long totalOrders;
    private double totalCodVolume;
    private int activeOrders;
    private int pendingSettlements;
    private double systemRevenue;
    private int fraudAlerts;

    public AdminDashboardResponse() {
    }

    // Getters and Setters
    public long getTotalShops() {
        return totalShops;
    }

    public void setTotalShops(long totalShops) {
        this.totalShops = totalShops;
    }

    public long getTotalShippers() {
        return totalShippers;
    }

    public void setTotalShippers(long totalShippers) {
        this.totalShippers = totalShippers;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public double getTotalCodVolume() {
        return totalCodVolume;
    }

    public void setTotalCodVolume(double totalCodVolume) {
        this.totalCodVolume = totalCodVolume;
    }

    public int getActiveOrders() {
        return activeOrders;
    }

    public void setActiveOrders(int activeOrders) {
        this.activeOrders = activeOrders;
    }

    public int getPendingSettlements() {
        return pendingSettlements;
    }

    public void setPendingSettlements(int pendingSettlements) {
        this.pendingSettlements = pendingSettlements;
    }

    public double getSystemRevenue() {
        return systemRevenue;
    }

    public void setSystemRevenue(double systemRevenue) {
        this.systemRevenue = systemRevenue;
    }

    public int getFraudAlerts() {
        return fraudAlerts;
    }

    public void setFraudAlerts(int fraudAlerts) {
        this.fraudAlerts = fraudAlerts;
    }
}
