package com.example.backend.controller;

import com.example.backend.model.Settlement;
import com.example.backend.repository.SettlementRepository;
import com.example.backend.service.SettlementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.backend.dto.CodReportRow;
import com.example.backend.service.ReportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

        private final SettlementRepository settlementRepository;
        private final SettlementService settlementService;

        private final com.example.backend.service.OrderService orderService;
        private final com.example.backend.repository.UserRepository userRepository;
        private final com.example.backend.repository.LedgerRepository ledgerRepository;
        private final ReportService reportService;

        public AdminController(SettlementRepository settlementRepository, SettlementService settlementService,
                        com.example.backend.service.OrderService orderService,
                        com.example.backend.repository.UserRepository userRepository,
                        com.example.backend.repository.LedgerRepository ledgerRepository,
                        ReportService reportService) {
                this.settlementRepository = settlementRepository;
                this.settlementService = settlementService;
                this.orderService = orderService;
                this.userRepository = userRepository;
                this.ledgerRepository = ledgerRepository;
                this.reportService = reportService;
        }

        @GetMapping("/dashboard")
        public ResponseEntity<com.example.backend.dto.dashboard.AdminDashboardResponse> getDashboard() {
                return ResponseEntity.ok(orderService.getAdminDashboardStats());
        }

        @GetMapping("/settlements")
        public ResponseEntity<List<Map<String, Object>>> getAllSettlements() {
                List<Settlement> settlements = settlementRepository.findAll();
                List<Map<String, Object>> response = settlements.stream().map(s -> {
                        Map<String, Object> map = new java.util.HashMap<>();
                        map.put("id", s.getId());
                        map.put("shipperName", s.getShipper() != null ? s.getShipper().getName() : "N/A");
                        map.put("shopName", s.getShop() != null ? s.getShop().getName() : "N/A");
                        map.put("totalAmount", s.getTotalAmount());
                        map.put("status", s.getStatus());
                        map.put("createdAt", s.getCreatedAt());
                        return map;
                }).collect(Collectors.toList());
                return ResponseEntity.ok(response);
        }

        @PostMapping("/settlements/{id}/confirm")
        public ResponseEntity<Void> confirmSettlement(@PathVariable Long id) {
                settlementService.adminConfirmSettlement(id);
                return ResponseEntity.ok().build();
        }

        @GetMapping("/shops")
        public ResponseEntity<List<Map<String, Object>>> getShops() {
                List<com.example.backend.model.User> shops = userRepository
                                .findByRole(com.example.backend.model.Role.SHOP);
                List<Map<String, Object>> response = shops.stream().map(s -> {
                        Map<String, Object> map = new java.util.HashMap<>();
                        map.put("id", s.getId());
                        map.put("name", s.getName());
                        map.put("email", s.getEmail());
                        map.put("phone", s.getPhone());
                        map.put("status", s.getStatus());

                        // Calculate balance (Receivable)
                        double balance = ledgerRepository.findByShop(s).stream()
                                        .filter(l -> l.getSettlement() == null
                                                        || l.getSettlement()
                                                                        .getStatus() != com.example.backend.model.SettlementStatus.CONFIRMED)
                                        .mapToDouble(com.example.backend.model.Ledger::getAmount).sum();
                        map.put("balance", balance);

                        return map;
                }).collect(Collectors.toList());
                return ResponseEntity.ok(response);
        }

        @PatchMapping("/shops/{id}/status")
        public ResponseEntity<Void> updateShopStatus(@PathVariable java.util.UUID id,
                        @RequestBody Map<String, String> body) {
                com.example.backend.model.User shop = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Shop not found"));
                shop.setStatus(body.get("status"));
                userRepository.save(shop);
                return ResponseEntity.ok().build();
        }

        @GetMapping("/shippers")
        public ResponseEntity<List<Map<String, Object>>> getShippers() {
                List<com.example.backend.model.User> shippers = userRepository
                                .findByRole(com.example.backend.model.Role.SHIPPER);
                List<Map<String, Object>> response = shippers.stream().map(s -> {
                        Map<String, Object> map = new java.util.HashMap<>();
                        map.put("id", s.getId());
                        map.put("name", s.getName());
                        map.put("email", s.getEmail());
                        map.put("phone", s.getPhone());
                        map.put("status", s.getStatus());

                        // Calculate Holding Amount
                        double holdingAmount = ledgerRepository.findByShipper(s).stream()
                                        .mapToDouble(com.example.backend.model.Ledger::getAmount).sum();
                        map.put("holdingAmount", holdingAmount);

                        return map;
                }).collect(Collectors.toList());
                return ResponseEntity.ok(response);
        }

        @PatchMapping("/shippers/{id}/status")
        public ResponseEntity<Void> updateShipperStatus(@PathVariable java.util.UUID id,
                        @RequestBody Map<String, String> body) {
                com.example.backend.model.User shipper = userRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Shipper not found"));
                shipper.setStatus(body.get("status"));
                userRepository.save(shipper);
                return ResponseEntity.ok().build();
        }

        @GetMapping("/orders")
        public ResponseEntity<List<Map<String, Object>>> getOrders() {
                List<com.example.backend.model.Order> orders = orderService.getAllOrders();
                List<Map<String, Object>> response = orders.stream().map(o -> {
                        Map<String, Object> map = new java.util.HashMap<>();
                        map.put("id", o.getId());
                        map.put("orderCode", o.getOrderCode());
                        map.put("shopName", o.getShop() != null ? o.getShop().getName() : "N/A");
                        map.put("shipperName", o.getShipper() != null ? o.getShipper().getName() : "Chưa gán");
                        map.put("shipperPhone", o.getShipper() != null ? o.getShipper().getPhone() : "N/A");
                        map.put("receiverName", o.getReceiverName());
                        map.put("receiverPhone", o.getReceiverPhone());
                        map.put("codAmount", o.getCodAmount());
                        map.put("shippingFee", o.getShippingFee());
                        map.put("status", o.getStatus());
                        map.put("createdAt", o.getCreatedAt());
                        map.put("deliveredAt", o.getDeliveredAt());
                        return map;
                }).collect(Collectors.toList());
                return ResponseEntity.ok(response);
        }

        @GetMapping("/reports/cod")
        public ResponseEntity<Map<String, Object>> getCodReport(
                        @RequestParam(required = false) String startDate,
                        @RequestParam(required = false) String endDate) {

                LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate + "T00:00:00")
                                : LocalDateTime.now().minusDays(30);
                LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate + "T23:59:59") : LocalDateTime.now();

                List<com.example.backend.model.Ledger> ledgers = ledgerRepository.findByCreatedAtBetween(start, end);

                double totalCodCollected = ledgers.stream()
                                .filter(l -> l.getType() == com.example.backend.model.LedgerType.COD_COLLECTED)
                                .mapToDouble(com.example.backend.model.Ledger::getAmount).sum();

                double totalFees = ledgers.stream()
                                .filter(l -> l.getType() == com.example.backend.model.LedgerType.SHIPPING_FEE)
                                .mapToDouble(l -> Math.abs(l.getAmount())).sum();

                double codShipperHolding = ledgers.stream()
                                .filter(l -> l.getType() == com.example.backend.model.LedgerType.COD_COLLECTED
                                                && l.getSettlement() == null)
                                .mapToDouble(com.example.backend.model.Ledger::getAmount).sum();

                double feesShipperHolding = ledgers.stream()
                                .filter(l -> l.getType() == com.example.backend.model.LedgerType.SHIPPING_FEE
                                                && l.getSettlement() == null)
                                .mapToDouble(l -> Math.abs(l.getAmount())).sum();

                double settledAmount = ledgers.stream()
                                .filter(l -> l.getSettlement() != null
                                                && l.getSettlement()
                                                                .getStatus() == com.example.backend.model.SettlementStatus.CONFIRMED)
                                .filter(l -> l.getType() == com.example.backend.model.LedgerType.COD_COLLECTED)
                                .mapToDouble(com.example.backend.model.Ledger::getAmount).sum();

                double netHolding = codShipperHolding - feesShipperHolding;

                Map<String, Object> response = new java.util.HashMap<>();
                response.put("totalCodCollected", totalCodCollected);
                response.put("totalFees", totalFees);
                response.put("codShipperHolding", Math.max(0, netHolding));
                response.put("shopDebtToShipper", Math.max(0, -netHolding));
                response.put("settledAmount", settledAmount);
                response.put("ledgerCount", ledgers.size());

                return ResponseEntity.ok(response);
        }

        @GetMapping("/reports/cod/export/excel")
        public ResponseEntity<byte[]> exportExcel(
                        @RequestParam(required = false) String startDate,
                        @RequestParam(required = false) String endDate) throws java.io.IOException {

                LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate + "T00:00:00")
                                : LocalDateTime.now().minusDays(30);
                LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate + "T23:59:59") : LocalDateTime.now();

                List<CodReportRow> rows = reportService.getAdminCodReportData(start, end);
                byte[] data = reportService.exportToExcelForAdmin(rows);

                return ResponseEntity.ok()
                                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=admin-cod-report.xlsx")
                                .contentType(MediaType.parseMediaType(
                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(data);
        }

        @GetMapping("/reports/cod/export/pdf")
        public ResponseEntity<byte[]> exportPdf(
                        @RequestParam(required = false) String startDate,
                        @RequestParam(required = false) String endDate) throws Exception {

                LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate + "T00:00:00")
                                : LocalDateTime.now().minusDays(30);
                LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate + "T23:59:59") : LocalDateTime.now();

                List<CodReportRow> rows = reportService.getAdminCodReportData(start, end);
                byte[] data = reportService.exportToPdf(rows, "ADMIN COD REPORT");

                return ResponseEntity.ok()
                                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=admin-cod-report.pdf")
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(data);
        }
}
