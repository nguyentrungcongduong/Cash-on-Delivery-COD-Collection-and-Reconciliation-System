package com.example.backend.dto.settlement;

public class ShipperSettlementSummary {
    private Double totalCod;
    private Double totalFees;
    private Double netAmount; // totalCod - totalFees (Số tiền nộp)

    public ShipperSettlementSummary(Double totalCod, Double totalFees) {
        this.totalCod = totalCod;
        this.totalFees = totalFees;
        this.netAmount = totalCod - totalFees;
    }

    // Getters
    public Double getTotalCod() {
        return totalCod;
    }

    public Double getTotalFees() {
        return totalFees;
    }

    public Double getNetAmount() {
        return netAmount;
    }
}
