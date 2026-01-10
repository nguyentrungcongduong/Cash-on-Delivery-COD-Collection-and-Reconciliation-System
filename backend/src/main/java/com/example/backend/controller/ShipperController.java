package com.example.backend.controller;

import com.example.backend.dto.dashboard.ShipperDashboardResponse;
import com.example.backend.dto.settlement.ShipperSettlementSummary;
import com.example.backend.model.Order;
import com.example.backend.model.OrderStatus;
import com.example.backend.model.User;
import com.example.backend.service.OrderService;
import com.example.backend.service.LedgerService;
import com.example.backend.service.SettlementService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/shipper")
@CrossOrigin(origins = "*")
public class ShipperController {

    private final OrderService orderService;
    private final LedgerService ledgerService;
    private final SettlementService settlementService;

    public ShipperController(OrderService orderService, LedgerService ledgerService,
            SettlementService settlementService) {
        this.orderService = orderService;
        this.ledgerService = ledgerService;
        this.settlementService = settlementService;
    }

    @PostMapping("/settlement/request")
    public ResponseEntity<Void> requestSettlement(@AuthenticationPrincipal User shipper) {
        settlementService.requestSettlement(shipper);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/settlement/summary")
    public ResponseEntity<ShipperSettlementSummary> getSettlementSummary(@AuthenticationPrincipal User shipper) {
        return ResponseEntity.ok(ledgerService.getShipperSummary(shipper));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ShipperDashboardResponse> getDashboard(@AuthenticationPrincipal User shipper) {
        return ResponseEntity.ok(orderService.getShipperDashboardStats(shipper));
    }

    @GetMapping("/orders")
    public ResponseEntity<Map<String, Object>> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal User shipper) {

        List<OrderStatus> statuses;
        if (status != null && !status.isEmpty()) {
            statuses = Arrays.stream(status.split(","))
                    .map(OrderStatus::valueOf)
                    .collect(Collectors.toList());
        } else {
            statuses = Arrays.asList(OrderStatus.CREATED, OrderStatus.ASSIGNED, OrderStatus.PICKED_UP,
                    OrderStatus.DELIVERING);
        }

        List<Order> orders = orderService.getShipperOrdersByStatus(shipper, statuses);

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", orders);
        response.put("totalElements", orders.size());

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        OrderStatus status = OrderStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }

    @PostMapping("/orders/{id}/deliver")
    public ResponseEntity<Order> deliverOrder(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User shipper) {
        String result = body.get("result");
        String reason = body.get("reason");
        return ResponseEntity.ok(orderService.deliverOrder(id, result, reason, shipper));
    }
}
