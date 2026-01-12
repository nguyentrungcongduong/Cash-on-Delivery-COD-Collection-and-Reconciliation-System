package com.example.backend.repository;

import com.example.backend.model.Order;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByShop(User shop);

    List<Order> findByShipper(User shipper);

    List<Order> findByStatusIn(List<com.example.backend.model.OrderStatus> statuses);

    List<Order> findByShipperAndStatusIn(User shipper, List<com.example.backend.model.OrderStatus> statuses);

    List<Order> findByShopAndStatusAndDeliveredAtBetween(User shop, com.example.backend.model.OrderStatus status,
            java.time.LocalDateTime start, java.time.LocalDateTime end);

    boolean existsByOrderCode(String orderCode);
}
