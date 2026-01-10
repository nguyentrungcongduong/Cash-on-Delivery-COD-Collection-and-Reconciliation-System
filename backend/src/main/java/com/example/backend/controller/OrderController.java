package com.example.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @GetMapping("/stats")
    public ResponseEntity<?> getOrderStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", 0);
        stats.put("totalCodAmount", 0);
        stats.put("collectedAmount", 0);
        stats.put("pendingAmount", 0);
        stats.put("failedAmount", 0);
        stats.put("shipperDebt", 0);
        stats.put("successRate", 100);
        stats.put("todayOrders", 0);
        stats.put("todayRevenue", 0);
        stats.put("pendingReceivable", 0);
        stats.put("overdueSettlements", 0);
        return ResponseEntity.ok(stats);
    }

    @GetMapping
    public ResponseEntity<?> getOrders(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Map<String, Object> response = new HashMap<>();
        response.put("content", new ArrayList<>());
        response.put("totalElements", 0);
        response.put("totalPages", 0);
        return ResponseEntity.ok(response);
    }
}
