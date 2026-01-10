package com.example.backend.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "settlements")
public class Settlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private User shop;

    @ManyToOne
    @JoinColumn(name = "shipper_id")
    private User shipper;

    @Column(nullable = false)
    private Double totalAmount; // Số tiền đối soát

    @Enumerated(EnumType.STRING)
    private SettlementStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "settlement")
    @JsonIgnore
    private List<Ledger> ledgers;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null)
            status = SettlementStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public SettlementStatus getStatus() {
        return status;
    }

    public void setStatus(SettlementStatus status) {
        this.status = status;
    }

    public List<Ledger> getLedgers() {
        return ledgers;
    }

    public void setLedgers(List<Ledger> ledgers) {
        this.ledgers = ledgers;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
