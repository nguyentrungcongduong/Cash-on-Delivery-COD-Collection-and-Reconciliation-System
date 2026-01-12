package com.example.backend.controller;

import com.example.backend.dto.dashboard.ShopDashboardResponse;
import com.example.backend.dto.CreateOrderRequest;
import com.example.backend.model.Order;
import com.example.backend.model.User;
import com.example.backend.service.OrderService;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.LedgerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.example.backend.dto.CodReportRow;
import com.example.backend.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/shop")
@CrossOrigin(origins = "*")
public class ShopController {

        private final OrderService orderService;
        private final com.example.backend.service.SettlementService settlementService;
        private final com.example.backend.repository.SettlementRepository settlementRepository;
        private final com.example.backend.repository.UserRepository userRepository;
        private final OrderRepository orderRepository;
        private final LedgerRepository ledgerRepository;
        private final ReportService reportService;

        public ShopController(OrderService orderService,
                        com.example.backend.service.SettlementService settlementService,
                        com.example.backend.repository.SettlementRepository settlementRepository,
                        com.example.backend.repository.UserRepository userRepository,
                        OrderRepository orderRepository,
                        LedgerRepository ledgerRepository,
                        ReportService reportService) {
                this.orderService = orderService;
                this.settlementService = settlementService;
                this.settlementRepository = settlementRepository;
                this.userRepository = userRepository;
                this.orderRepository = orderRepository;
                this.ledgerRepository = ledgerRepository;
                this.reportService = reportService;
        }

        @PostMapping("/settlements/{id}/confirm")
        public ResponseEntity<Void> confirmSettlement(@PathVariable Long id) {
                settlementService.shopConfirmSettlement(id);
                return ResponseEntity.ok().build();
        }

        @GetMapping("/settlements")
        public ResponseEntity<java.util.List<java.util.Map<String, Object>>> getSettlements(
                        @org.springframework.security.core.annotation.AuthenticationPrincipal com.example.backend.model.User shop) {
                java.util.List<com.example.backend.model.Settlement> settlements = settlementRepository
                                .findByShop(shop);
                java.util.List<java.util.Map<String, Object>> response = settlements.stream().map(s -> {
                        java.util.Map<String, Object> map = new java.util.HashMap<>();
                        map.put("id", s.getId());
                        map.put("shipperName", s.getShipper() != null ? s.getShipper().getName() : "N/A");
                        map.put("totalAmount", s.getTotalAmount());
                        map.put("status", s.getStatus());
                        map.put("createdAt", s.getCreatedAt());
                        return map;
                }).collect(java.util.stream.Collectors.toList());
                return ResponseEntity.ok(response);
        }

        @GetMapping("/dashboard")
        public ResponseEntity<ShopDashboardResponse> getDashboard(@AuthenticationPrincipal User shop) {
                return ResponseEntity.ok(orderService.getShopDashboardStats(shop));
        }

        @GetMapping("/dashboard/revenue-7-days")
        public ResponseEntity<List<Map<String, Object>>> getRevenueLast7Days(@AuthenticationPrincipal User shop) {
                LocalDateTime end = LocalDateTime.now();
                LocalDateTime start = end.minusDays(6).withHour(0).withMinute(0).withSecond(0);

                List<Order> orders = orderRepository.findByShopAndStatusAndDeliveredAtBetween(
                                shop,
                                com.example.backend.model.OrderStatus.DELIVERED_SUCCESS,
                                start,
                                end);

                List<Map<String, Object>> response = new java.util.ArrayList<>();
                java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");

                for (int i = 0; i < 7; i++) {
                        java.time.LocalDate date = start.toLocalDate().plusDays(i);
                        double dailyRevenue = orders.stream()
                                        .filter(o -> o.getDeliveredAt() != null
                                                        && o.getDeliveredAt().toLocalDate().equals(date))
                                        .mapToDouble(Order::getCodAmount)
                                        .sum();

                        Map<String, Object> entry = new HashMap<>();
                        entry.put("date", date.format(dtf));
                        entry.put("revenue", dailyRevenue);
                        response.add(entry);
                }

                return ResponseEntity.ok(response);
        }

        @GetMapping("/dashboard/orders-7-days")
        public ResponseEntity<List<Map<String, Object>>> getOrdersLast7Days(@AuthenticationPrincipal User shop) {
                LocalDateTime end = LocalDateTime.now();
                LocalDateTime start = end.minusDays(6).withHour(0).withMinute(0).withSecond(0);

                List<Order> orders = orderRepository.findByShopAndStatusAndDeliveredAtBetween(
                                shop,
                                com.example.backend.model.OrderStatus.DELIVERED_SUCCESS,
                                start,
                                end);

                List<Map<String, Object>> response = new java.util.ArrayList<>();
                java.time.format.DateTimeFormatter dtf = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");

                for (int i = 0; i < 7; i++) {
                        java.time.LocalDate date = start.toLocalDate().plusDays(i);
                        long dailyOrders = orders.stream()
                                        .filter(o -> o.getDeliveredAt() != null
                                                        && o.getDeliveredAt().toLocalDate().equals(date))
                                        .count();

                        Map<String, Object> entry = new HashMap<>();
                        entry.put("date", date.format(dtf));
                        entry.put("totalOrders", dailyOrders);
                        response.add(entry);
                }

                return ResponseEntity.ok(response);
        }

        @PostMapping("/orders")
        public ResponseEntity<Order> createOrder(
                        @RequestBody CreateOrderRequest request,
                        @AuthenticationPrincipal User shop) {
                return ResponseEntity.ok(orderService.createOrder(request, shop));
        }

        @GetMapping("/orders")
        public ResponseEntity<java.util.List<java.util.Map<String, Object>>> getOrders(
                        @AuthenticationPrincipal User shop) {
                java.util.List<Order> orders = orderService.getShopOrders(shop);
                java.util.List<java.util.Map<String, Object>> response = orders.stream().map(o -> {
                        java.util.Map<String, Object> map = new java.util.HashMap<>();
                        map.put("id", o.getId());
                        map.put("orderCode", o.getOrderCode());
                        map.put("receiverName", o.getReceiverName());
                        map.put("receiverPhone", o.getReceiverPhone());
                        map.put("receiverAddress", o.getReceiverAddress());
                        map.put("pickupAddress", o.getPickupAddress());
                        map.put("productName", o.getProductName());
                        map.put("codAmount", o.getCodAmount());
                        map.put("shippingFee", o.getShippingFee());
                        map.put("status", o.getStatus());
                        map.put("createdAt", o.getCreatedAt());
                        map.put("deliveredAt", o.getDeliveredAt());
                        map.put("allowInspection", o.getAllowInspection());
                        map.put("shipperNote", o.getShipperNote());
                        map.put("shipperName", o.getShipper() != null ? o.getShipper().getName() : "Chưa gán");
                        map.put("shipperId", o.getShipper() != null ? o.getShipper().getId() : null);
                        map.put("shipperPhone", o.getShipper() != null ? o.getShipper().getPhone() : "N/A");
                        return map;
                }).collect(java.util.stream.Collectors.toList());
                return ResponseEntity.ok(response);
        }

        @GetMapping("/shippers")
        public ResponseEntity<java.util.List<com.example.backend.dto.ShipperResponse>> getShippers() {
                java.util.List<com.example.backend.dto.ShipperResponse> shippers = userRepository
                                .findByRole(com.example.backend.model.Role.SHIPPER)
                                .stream()
                                .map(u -> new com.example.backend.dto.ShipperResponse(u.getId(), u.getName(),
                                                u.getPhone()))
                                .collect(java.util.stream.Collectors.toList());
                return ResponseEntity.ok(shippers);
        }

        @DeleteMapping("/orders/{id}")
        public ResponseEntity<Void> deleteOrder(@PathVariable Long id, @AuthenticationPrincipal User shop) {
                orderService.deleteOrder(id, shop);
                return ResponseEntity.ok().build();
        }

        @GetMapping("/reports/cod")
        public ResponseEntity<Map<String, Object>> getCodReport(
                        @RequestParam(required = false) String startDate,
                        @RequestParam(required = false) String endDate,
                        @AuthenticationPrincipal User shop) {

                LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate + "T00:00:00")
                                : LocalDateTime.now().minusDays(30);
                LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate + "T23:59:59") : LocalDateTime.now();

                List<com.example.backend.model.Ledger> ledgers = ledgerRepository.findByShopAndCreatedAtBetween(shop,
                                start,
                                end);

                double totalCod = ledgers.stream()
                                .filter(l -> l.getType() == com.example.backend.model.LedgerType.COD_COLLECTED)
                                .mapToDouble(com.example.backend.model.Ledger::getAmount).sum();

                double received = ledgers.stream()
                                .filter(l -> l.getSettlement() != null
                                                && l.getSettlement()
                                                                .getStatus() == com.example.backend.model.SettlementStatus.CONFIRMED)
                                .filter(l -> l.getType() == com.example.backend.model.LedgerType.COD_COLLECTED)
                                .mapToDouble(com.example.backend.model.Ledger::getAmount).sum();

                // Successful orders count - ideally we should filter orders by deliveredAt if
                // possible
                // but for MVP we can count orders belonging to this shop with SUCCESS status in
                // this range
                // However, Order doesn't have a deliveredAt field in the model yet? Wait, I
                // added it in DatabaseFixer.
                // Let's check Order model.
                long successfulOrders = orderRepository.findByShop(shop).stream()
                                .filter(o -> o.getStatus() == com.example.backend.model.OrderStatus.DELIVERED_SUCCESS)
                                .filter(o -> o.getDeliveredAt() != null && !o.getDeliveredAt().isBefore(start)
                                                && !o.getDeliveredAt().isAfter(end))
                                .count();

                double totalFees = ledgers.stream()
                                .filter(l -> l.getType() == com.example.backend.model.LedgerType.SHIPPING_FEE)
                                .mapToDouble(l -> Math.abs(l.getAmount())).sum();

                double unsettledNet = ledgers.stream()
                                .filter(l -> l.getSettlement() == null)
                                .mapToDouble(com.example.backend.model.Ledger::getAmount).sum();

                Map<String, Object> response = new HashMap<>();
                response.put("totalCod", totalCod);
                response.put("totalFees", totalFees);
                response.put("received", received);
                response.put("pending", Math.max(0, unsettledNet));
                response.put("pendingPayable", Math.max(0, -unsettledNet));
                response.put("successfulOrders", successfulOrders);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/reports/cod/export/excel")
        public ResponseEntity<byte[]> exportExcel(
                        @RequestParam(required = false) String startDate,
                        @RequestParam(required = false) String endDate,
                        @AuthenticationPrincipal User shop) throws java.io.IOException {

                LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate + "T00:00:00")
                                : LocalDateTime.now().minusDays(30);
                LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate + "T23:59:59") : LocalDateTime.now();

                List<CodReportRow> rows = reportService.getShopCodReportData(shop, start, end);
                byte[] data = reportService.exportToExcelForShop(rows);

                return ResponseEntity.ok()
                                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=shop-cod-report.xlsx")
                                .contentType(
                                                MediaType.parseMediaType(
                                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(data);
        }

        @GetMapping("/reports/cod/export/pdf")
        public ResponseEntity<byte[]> exportPdf(
                        @RequestParam(required = false) String startDate,
                        @RequestParam(required = false) String endDate,
                        @AuthenticationPrincipal User shop) throws Exception {

                LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate + "T00:00:00")
                                : LocalDateTime.now().minusDays(30);
                LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate + "T23:59:59") : LocalDateTime.now();

                List<CodReportRow> rows = reportService.getShopCodReportData(shop, start, end);
                byte[] data = reportService.exportToPdf(rows, "SHOP COD REPORT");

                return ResponseEntity.ok()
                                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=shop-cod-report.pdf")
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(data);
        }

        @GetMapping("/profile")
        public ResponseEntity<com.example.backend.dto.ShopProfileResponse> getProfile(
                        @AuthenticationPrincipal User shop) {
                com.example.backend.dto.ShopProfileResponse.BankAccountInfo bankInfo = new com.example.backend.dto.ShopProfileResponse.BankAccountInfo(
                                shop.getBankName(),
                                shop.getAccountNumber(),
                                shop.getAccountHolder(),
                                shop.getBankBranch());

                return ResponseEntity.ok(new com.example.backend.dto.ShopProfileResponse(
                                shop.getName(),
                                shop.getId().toString(),
                                shop.getPhone(),
                                shop.getEmail(),
                                shop.getAddress(),
                                shop.getCreatedAt() != null ? shop.getCreatedAt().toString() : "",
                                bankInfo));
        }

        @PutMapping("/profile")
        public ResponseEntity<com.example.backend.dto.ShopProfileResponse> updateProfile(
                        @RequestBody com.example.backend.dto.ShopProfileUpdateRequest request,
                        @AuthenticationPrincipal User shop) {

                if (request.getShopName() != null)
                        shop.setName(request.getShopName());
                if (request.getPhone() != null)
                        shop.setPhone(request.getPhone());
                if (request.getAddress() != null)
                        shop.setAddress(request.getAddress());

                if (request.getBankAccount() != null) {
                        shop.setBankName(request.getBankAccount().getBankName());
                        shop.setAccountNumber(request.getBankAccount().getAccountNumber());
                        shop.setAccountHolder(request.getBankAccount().getAccountHolder());
                        shop.setBankBranch(request.getBankAccount().getBranch());
                }

                User updatedShop = userRepository.save(shop);
                return getProfile(updatedShop);
        }
}
