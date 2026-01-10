package com.example.backend.repository;

import com.example.backend.model.Settlement;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SettlementRepository extends JpaRepository<Settlement, Long> {
    List<Settlement> findByShipper(User shipper);

    List<Settlement> findByShop(User shop);
}
