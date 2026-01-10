package com.example.backend.service;

import com.example.backend.model.*;
import com.example.backend.repository.SettlementRepository;
import com.example.backend.repository.LedgerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SettlementService {

    private final SettlementRepository settlementRepository;
    private final LedgerRepository ledgerRepository;
    private final NotificationService notificationService;
    private final com.example.backend.repository.UserRepository userRepository;

    public SettlementService(SettlementRepository settlementRepository,
            LedgerRepository ledgerRepository,
            NotificationService notificationService,
            com.example.backend.repository.UserRepository userRepository) {
        this.settlementRepository = settlementRepository;
        this.ledgerRepository = ledgerRepository;
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    @Transactional
    public void requestSettlement(User shipper) {
        // Lấy các ledgers chưa đối soát của shipper
        List<Ledger> ledgers = ledgerRepository.findByShipper(shipper).stream()
                .filter(l -> l.getSettlement() == null)
                .collect(Collectors.toList());

        if (ledgers.isEmpty())
            return;

        // Group by shop? Không, user chỉ nói Admin chọn shipper gộp ledgers
        // Để đơn giản MVP, ta gộp tất cả ledgers hiện tại của shipper này thành các
        // settlement theo từng Shop.

        java.util.Map<User, List<Ledger>> byShop = ledgers.stream()
                .collect(java.util.stream.Collectors.groupingBy(Ledger::getShop));

        for (java.util.Map.Entry<User, List<Ledger>> entry : byShop.entrySet()) {
            User shop = entry.getKey();
            List<Ledger> shopLedgers = entry.getValue();

            Double total = shopLedgers.stream().mapToDouble(Ledger::getAmount).sum();

            Settlement settlement = new Settlement();
            settlement.setShipper(shipper);
            settlement.setShop(shop);
            settlement.setTotalAmount(total);
            settlement.setStatus(SettlementStatus.PENDING);

            final Settlement savedSettlement = settlementRepository.save(settlement);

            shopLedgers.forEach(l -> {
                l.setSettlement(savedSettlement);
                ledgerRepository.save(l);
            });

            // NOTIFY ALL ADMINS
            String title = "💰 Yêu cầu xác nhận nộp tiền";
            String content = String.format("Shipper %s đã nộp %,.0fđ cho Shop %s. Cần xác nhận.",
                    shipper.getName(),
                    total,
                    shop.getName());

            List<User> admins = userRepository.findByRole(Role.ADMIN);
            for (User admin : admins) {
                notificationService.createNotification(admin, title, content);
            }
        }
    }

    @Transactional
    public void adminConfirmSettlement(Long settlementId) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));

        if (settlement.getStatus() != SettlementStatus.PENDING) {
            throw new RuntimeException("Settlement is already processed");
        }

        settlement.setStatus(SettlementStatus.PAID);
        settlementRepository.save(settlement);

        // SINH LEDGER SETTLEMENT (Để triệt tiêu nợ cho Shipper)
        // Số tiền nợ đang là + (COD - Fee). Giờ Shipper nộp, ta trừ đi số đó.
        Ledger settlementLedger = new Ledger();
        settlementLedger.setShipper(settlement.getShipper());
        settlementLedger.setShop(settlement.getShop());
        settlementLedger.setAmount(-settlement.getTotalAmount()); // Âm để giảm nợ
        settlementLedger.setType(LedgerType.SETTLEMENT_PAYMENT);
        settlementLedger.setSettlement(settlement);
        ledgerRepository.save(settlementLedger);

        // NOTIFY SHIPPER
        String title = "✅ Admin đã xác nhận tiền nộp";
        String content = String.format("Admin đã xác nhận số tiền %,.0fđ bạn nộp cho đơn đối soát %s.",
                settlement.getTotalAmount(),
                settlementId);
        notificationService.createNotification(settlement.getShipper(), title, content);

        System.out.println("✅ Admin confirmed settlement and generated ledger: " + settlementId);
    }

    @Transactional
    public void shopConfirmSettlement(Long settlementId) {
        Settlement settlement = settlementRepository.findById(settlementId)
                .orElseThrow(() -> new RuntimeException("Settlement not found"));
        settlement.setStatus(SettlementStatus.CONFIRMED);
        Settlement saved = settlementRepository.save(settlement);

        // NOTIFY SHIPPER & ADMIN?
        // Typically Shop confirms to finish the cycle.
        String title = "🏁 Shop đã đối soát thành công";
        String content = String.format("Shop %s đã xác nhận đối soát xong cho yêu cầu %s.",
                saved.getShop().getName(),
                settlementId);
        notificationService.createNotification(saved.getShipper(), title, content);

        List<User> admins = userRepository.findByRole(Role.ADMIN);
        for (User admin : admins) {
            notificationService.createNotification(admin, title, content);
        }
    }
}
