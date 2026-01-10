package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.LedgerRepository;
import com.example.backend.dto.CreateOrderRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Random;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final LedgerRepository ledgerRepository;
    private final com.example.backend.repository.UserRepository userRepository;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository, LedgerRepository ledgerRepository,
            com.example.backend.repository.UserRepository userRepository,
            NotificationService notificationService) {
        this.orderRepository = orderRepository;
        this.ledgerRepository = ledgerRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public Order deliverOrder(Long orderId, String result, String reason, User currentShipper) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        if (currentShipper == null) {
            throw new RuntimeException("Authentication error: No authenticated shipper found");
        }

        // If order has no shipper, assign the current user
        if (order.getShipper() == null) {
            order.setShipper(currentShipper);
        } else if (!order.getShipper().getId().equals(currentShipper.getId())) {
            throw new RuntimeException("Access denied: This order is assigned to another shipper");
        }

        if ("SUCCESS".equalsIgnoreCase(result)) {
            if (order.getShipper() == null) {
                throw new RuntimeException(
                        "Cannot deliver order: No shipper assigned to Order " + order.getOrderCode());
            }
            if (order.getShop() == null) {
                throw new RuntimeException(
                        "Cannot deliver order: No shop associated with Order " + order.getOrderCode());
            }
            if (order.getCodAmount() == null || order.getShippingFee() == null) {
                throw new RuntimeException(
                        "Cannot deliver order: COD amount or Shipping fee is null for Order " + order.getOrderCode());
            }

            order.setStatus(OrderStatus.DELIVERED_SUCCESS);
            order.setDeliveredAt(java.time.LocalDateTime.now());

            // NOTIFY SHOP
            String title = "✅ Đơn hàng giao thành công";
            String content = String.format("Đơn %s đã được %s giao thành công. COD: %,.0fđ",
                    order.getOrderCode(),
                    order.getShipper().getName(),
                    order.getCodAmount());
            notificationService.createNotification(order.getShop(), title, content);

            // ✅ SINH LEDGER
            // 1. COD COLLECTED (+Amount cho Shipper nợ hệ thống)
            Ledger codLedger = new Ledger(order, order.getShop(), order.getShipper(),
                    order.getCodAmount(), LedgerType.COD_COLLECTED);
            ledgerRepository.save(codLedger);

            // 2. SHIPPING FEE (-Amount phí ship thu từ Shipper)
            Ledger feeLedger = new Ledger(order, order.getShop(), order.getShipper(),
                    -order.getShippingFee(), LedgerType.SHIPPING_FEE);
            ledgerRepository.save(feeLedger);

            System.out.println("✅ Generated ledgers for order: " + order.getOrderCode());
        } else {
            order.setStatus(OrderStatus.DELIVERY_FAILED);
            order.setFailedAt(java.time.LocalDateTime.now());
            order.setFailReason(reason != null ? reason : "Khách không nhận/Không liên lạc được");

            // NOTIFY SHOP
            String title = "❌ Đơn hàng giao thất bại";
            String content = String.format("Đơn %s giao thất bại. Lý do: %s",
                    order.getOrderCode(),
                    order.getFailReason());
            notificationService.createNotification(order.getShop(), title, content);
            System.out.println("❌ Marked order as FAILED: " + order.getOrderCode());
        }

        return orderRepository.save(order);
    }

    public Order createOrder(CreateOrderRequest request, User shop) {
        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setReceiverName(request.getReceiverName());
        order.setReceiverPhone(request.getReceiverPhone());
        order.setReceiverAddress(request.getReceiverAddress());
        order.setPickupAddress(request.getPickupAddress());
        order.setProductName(request.getProductName());
        order.setWeight(request.getWeight());
        order.setCodAmount(request.getCodAmount());
        order.setShippingFee(request.getShippingFee());
        order.setShipperNote(request.getShipperNote());
        order.setAllowInspection(request.getAllowInspection());
        order.setNote(request.getNote());
        order.setShop(shop);

        // Assign shipper if ID is provided
        if (request.getShipperId() != null && !request.getShipperId().isEmpty()) {
            try {
                // If it's a mock ID like "shipper1", we could handle it specially.
                // For now, let's assume it might be a UUID.
                java.util.UUID shipperUuid = java.util.UUID.fromString(request.getShipperId());
                userRepository.findById(shipperUuid).ifPresent(order::setShipper);
            } catch (IllegalArgumentException e) {
                // Not a UUID, maybe it's a mock ID. For MVP we can just log it.
                System.out.println("Invalid shipper UUID format: " + request.getShipperId());
            }
        }

        Order savedOrder = orderRepository.save(order);

        // CREATE NOTIFICATION FOR SHIPPER
        if (savedOrder.getShipper() != null) {
            String title = "📦 Đơn hàng mới cần giao";
            String content = String.format("%s | Shop: %s | COD: %,.0fđ",
                    savedOrder.getOrderCode(),
                    savedOrder.getShop().getName(),
                    savedOrder.getCodAmount());
            notificationService.createNotification(savedOrder.getShipper(), title, content);
        }

        return savedOrder;
    }

    public java.util.List<Order> getOrdersByStatus(java.util.List<com.example.backend.model.OrderStatus> statuses) {
        return orderRepository.findByStatusIn(statuses);
    }

    public java.util.List<Order> getShipperOrdersByStatus(User shipper,
            java.util.List<com.example.backend.model.OrderStatus> statuses) {
        return orderRepository.findByShipperAndStatusIn(shipper, statuses);
    }

    public Order updateOrderStatus(Long orderId, com.example.backend.model.OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public java.util.List<Order> getShopOrders(User shop) {
        return orderRepository.findByShop(shop);
    }

    public com.example.backend.dto.dashboard.ShipperDashboardResponse getShipperDashboardStats(User shipper) {
        java.util.List<Order> allOrders = orderRepository.findByShipper(shipper);
        java.util.List<Ledger> allLedgers = ledgerRepository.findByShipper(shipper);

        com.example.backend.dto.dashboard.ShipperDashboardResponse response = new com.example.backend.dto.dashboard.ShipperDashboardResponse();

        response.setTotalOrders(allOrders.size());
        response.setTotalCodAmount(allOrders.stream().mapToDouble(Order::getCodAmount).sum());

        long successful = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.DELIVERED_SUCCESS).count();
        response.setTodayDeliveries((int) successful);
        response.setSuccessRate(allOrders.isEmpty() ? 0 : (double) successful * 100 / allOrders.size());

        // Cash in hand = total COD collected - shipping fees (ledger logic)
        double codCollected = allLedgers.stream()
                .filter(l -> l.getType() == LedgerType.COD_COLLECTED && l.getSettlement() == null)
                .mapToDouble(Ledger::getAmount).sum();
        double fees = allLedgers.stream()
                .filter(l -> l.getType() == LedgerType.SHIPPING_FEE && l.getSettlement() == null)
                .mapToDouble(l -> Math.abs(l.getAmount())).sum();

        double netBalance = codCollected - fees;
        response.setCashInHand(Math.max(0, netBalance));
        response.setShipperDebt(Math.max(0, netBalance));
        response.setShopDebtToShipper(Math.max(0, -netBalance));

        response.setTodayOrders((int) allOrders.stream()
                .filter(o -> o.getCreatedAt().isAfter(java.time.LocalDate.now().atStartOfDay())).count());

        return response;
    }

    public com.example.backend.dto.dashboard.ShopDashboardResponse getShopDashboardStats(User shop) {
        java.util.List<Order> allOrders = orderRepository.findByShop(shop);
        java.util.List<Ledger> allLedgers = ledgerRepository.findByShop(shop);

        com.example.backend.dto.dashboard.ShopDashboardResponse response = new com.example.backend.dto.dashboard.ShopDashboardResponse();

        response.setTotalOrders(allOrders.size());
        response.setTotalCodAmount(allOrders.stream().mapToDouble(Order::getCodAmount).sum());

        long successful = allOrders.stream().filter(o -> o.getStatus() == OrderStatus.DELIVERED_SUCCESS).count();
        response.setSuccessRate(allOrders.isEmpty() ? 0 : (double) successful * 100 / allOrders.size());

        // Shipper debt = Sum of (COD - Fee) for all DELIVERED_SUCCESS orders that are
        // not yet settled
        double pendingNet = allLedgers.stream()
                .filter(l -> l.getSettlement() == null)
                .mapToDouble(Ledger::getAmount).sum();

        response.setPendingReceivable(Math.max(0, pendingNet));
        response.setShipperDebt(Math.max(0, pendingNet));
        response.setPendingPayable(Math.max(0, -pendingNet));

        double collected = allLedgers.stream()
                .filter(l -> l.getSettlement() != null && l.getSettlement().getStatus() == SettlementStatus.CONFIRMED)
                .mapToDouble(Ledger::getAmount).sum();
        response.setCollectedAmount(Math.max(0, collected));

        response.setTodayOrders((int) allOrders.stream()
                .filter(o -> o.getCreatedAt().isAfter(java.time.LocalDate.now().atStartOfDay())).count());

        return response;
    }

    public com.example.backend.dto.dashboard.AdminDashboardResponse getAdminDashboardStats() {
        com.example.backend.dto.dashboard.AdminDashboardResponse response = new com.example.backend.dto.dashboard.AdminDashboardResponse();

        response.setTotalOrders(orderRepository.count());
        response.setTotalShops(userRepository.findByRole(Role.SHOP).size());
        response.setTotalShippers(userRepository.findByRole(Role.SHIPPER).size());

        java.util.List<Order> allOrders = orderRepository.findAll();
        response.setTotalCodVolume(
                allOrders.stream().filter(o -> o.getCodAmount() != null).mapToDouble(Order::getCodAmount).sum());

        java.util.List<OrderStatus> activeStatuses = java.util.Arrays.asList(
                OrderStatus.CREATED, OrderStatus.ASSIGNED, OrderStatus.PICKED_UP, OrderStatus.DELIVERING);
        response.setActiveOrders((int) allOrders.stream().filter(o -> activeStatuses.contains(o.getStatus())).count());

        return response;
    }

    public java.util.List<Order> getAllOrders() {
        return orderRepository.findAll(org.springframework.data.domain.Sort
                .by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
    }

    @Transactional
    public void deleteOrder(Long orderId, User shop) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        if (!order.getShop().getId().equals(shop.getId())) {
            throw new RuntimeException("Access denied: This order does not belong to your shop");
        }

        // Only allow deleting orders that haven't been picked up/delivered
        if (order.getStatus() != OrderStatus.CREATED && order.getStatus() != OrderStatus.ASSIGNED) {
            throw new RuntimeException("Cannot delete order which is already " + order.getStatus());
        }

        orderRepository.delete(order);
    }

    private String generateOrderCode() {
        String code;
        Random random = new Random();
        do {
            code = "ORD-" + (100000 + random.nextInt(900000));
        } while (orderRepository.existsByOrderCode(code));
        return code;
    }
}
