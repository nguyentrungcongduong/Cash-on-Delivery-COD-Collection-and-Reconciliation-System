package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ledgers")
public class Ledger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private User shop;

    @ManyToOne
    @JoinColumn(name = "shipper_id")
    private User shipper;

    @Column(nullable = false)
    private Double amount; // +/-

    @ManyToOne
    @JoinColumn(name = "settlement_id")
    private Settlement settlement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LedgerType type;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Ledger() {
    }

    public Ledger(Order order, User shop, User shipper, Double amount, LedgerType type) {
        this.order = order;
        this.shop = shop;
        this.shipper = shipper;
        this.amount = amount;
        this.type = type;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
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

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Settlement getSettlement() {
        return settlement;
    }

    public void setSettlement(Settlement settlement) {
        this.settlement = settlement;
    }

    public LedgerType getType() {
        return type;
    }

    public void setType(LedgerType type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
