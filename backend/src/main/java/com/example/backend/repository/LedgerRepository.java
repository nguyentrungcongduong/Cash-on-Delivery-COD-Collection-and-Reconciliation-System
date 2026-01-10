package com.example.backend.repository;

import com.example.backend.model.Ledger;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LedgerRepository extends JpaRepository<Ledger, Long> {
    List<Ledger> findByShipper(User shipper);

    List<Ledger> findByShop(User shop);

    List<Ledger> findByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);

    List<Ledger> findByShopAndCreatedAtBetween(User shop, java.time.LocalDateTime start, java.time.LocalDateTime end);
}
