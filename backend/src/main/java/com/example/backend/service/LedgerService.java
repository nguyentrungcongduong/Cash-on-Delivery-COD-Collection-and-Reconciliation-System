package com.example.backend.service;

import com.example.backend.model.Ledger;
import com.example.backend.model.LedgerType;
import com.example.backend.model.User;
import com.example.backend.repository.LedgerRepository;
import com.example.backend.dto.settlement.ShipperSettlementSummary;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LedgerService {

    private final LedgerRepository ledgerRepository;

    public LedgerService(LedgerRepository ledgerRepository) {
        this.ledgerRepository = ledgerRepository;
    }

    public ShipperSettlementSummary getShipperSummary(User shipper) {
        List<Ledger> ledgers = ledgerRepository.findByShipper(shipper);

        Double totalCod = ledgers.stream()
                .filter(l -> l.getType() == LedgerType.COD_COLLECTED)
                .mapToDouble(Ledger::getAmount)
                .sum();

        Double totalFees = ledgers.stream()
                .filter(l -> l.getType() == LedgerType.SHIPPING_FEE)
                .mapToDouble(l -> Math.abs(l.getAmount()))
                .sum();

        return new ShipperSettlementSummary(totalCod, totalFees);
    }
}
