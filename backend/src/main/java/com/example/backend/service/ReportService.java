package com.example.backend.service;

import com.example.backend.dto.CodReportRow;
import com.example.backend.model.Ledger;
import com.example.backend.model.LedgerType;
import com.example.backend.model.User;
import com.example.backend.repository.LedgerRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Element;
import com.lowagie.text.Chunk;
import com.lowagie.text.Phrase;
import com.lowagie.text.FontFactory;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPCell;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final LedgerRepository ledgerRepository;

    public ReportService(LedgerRepository ledgerRepository) {
        this.ledgerRepository = ledgerRepository;
    }

    public List<CodReportRow> getShopCodReportData(User shop, LocalDateTime start, LocalDateTime end) {
        List<Ledger> ledgers = ledgerRepository.findByShopAndCreatedAtBetween(shop, start, end);
        return convertLedgersToReportRows(ledgers);
    }

    public List<CodReportRow> getAdminCodReportData(LocalDateTime start, LocalDateTime end) {
        List<Ledger> ledgers = ledgerRepository.findByCreatedAtBetween(start, end);
        return convertLedgersToReportRows(ledgers);
    }

    private List<CodReportRow> convertLedgersToReportRows(List<Ledger> ledgers) {
        return ledgers.stream()
                .filter(l -> l.getOrder() != null)
                .collect(Collectors.groupingBy(l -> l.getOrder().getId()))
                .values().stream()
                .map(orderLedgers -> {
                    Ledger first = orderLedgers.get(0);
                    double cod = orderLedgers.stream()
                            .filter(l -> l.getType() == LedgerType.COD_COLLECTED)
                            .mapToDouble(Ledger::getAmount).sum();
                    double fee = orderLedgers.stream()
                            .filter(l -> l.getType() == LedgerType.SHIPPING_FEE)
                            .mapToDouble(l -> Math.abs(l.getAmount())).sum();

                    CodReportRow row = new CodReportRow();
                    row.setOrderCode(first.getOrder().getOrderCode());
                    row.setDeliveredDate(first.getOrder().getDeliveredAt());
                    row.setCodAmount(cod);
                    row.setShippingFee(fee);
                    row.setNetAmount(cod - fee);
                    row.setStatus(first.getOrder().getStatus().toString());
                    row.setShopName(first.getShop() != null ? first.getShop().getName() : "N/A");
                    row.setShipperName(first.getShipper() != null ? first.getShipper().getName() : "N/A");
                    return row;
                })
                .collect(Collectors.toList());
    }

    /**
     * Export for Admin: Full columns (Order Code, Date, Shop, Shipper, COD, Fee,
     * Net, Status)
     */
    public byte[] exportToExcelForAdmin(List<CodReportRow> rows) throws IOException {
        String[] columns = { "Mã đơn", "Ngày giao", "Shop", "Shipper", "COD", "Phí ship", "Thực nhận", "Trạng thái" };
        return generateExcel(rows, columns, true);
    }

    /**
     * Export for Shop: 6 key columns (Order Code, Date, Shipper, COD, Fee, Net)
     */
    public byte[] exportToExcelForShop(List<CodReportRow> rows) throws IOException {
        String[] columns = { "Mã đơn", "Ngày giao", "Shipper", "COD", "Phí ship", "Thực nhận" };
        return generateExcel(rows, columns, false);
    }

    private byte[] generateExcel(List<CodReportRow> rows, String[] columns, boolean isAdmin) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Báo cáo COD");
            sheet.createFreezePane(0, 1); // Freeze header row

            // Styles
            DataFormat format = workbook.createDataFormat();

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFillForegroundColor(IndexedColors.LIGHT_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            CellStyle dateStyle = workbook.createCellStyle();
            dateStyle.setDataFormat(format.getFormat("dd/mm/yyyy"));

            CellStyle moneyStyle = workbook.createCellStyle();
            moneyStyle.setDataFormat(format.getFormat("#,##0\" đ\""));

            CellStyle boldMoneyStyle = workbook.createCellStyle();
            boldMoneyStyle.setDataFormat(format.getFormat("#,##0\" đ\""));
            org.apache.poi.ss.usermodel.Font boldFont = workbook.createFont();
            boldFont.setBold(true);
            boldMoneyStyle.setFont(boldFont);

            // Header
            org.apache.poi.ss.usermodel.Row headerRow = sheet.createRow(0);
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data
            int rowIdx = 1;
            for (CodReportRow r : rows) {
                org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowIdx++);
                int colIdx = 0;

                // Mã đơn
                row.createCell(colIdx++).setCellValue(r.getOrderCode());

                // Ngày giao
                Cell dateCell = row.createCell(colIdx++);
                if (r.getDeliveredDate() != null) {
                    dateCell.setCellValue(java.sql.Timestamp.valueOf(r.getDeliveredDate()));
                    dateCell.setCellStyle(dateStyle);
                }

                if (isAdmin) {
                    // Shop
                    row.createCell(colIdx++).setCellValue(r.getShopName());
                }

                // Shipper
                row.createCell(colIdx++).setCellValue(r.getShipperName());

                // COD
                Cell codCell = row.createCell(colIdx++);
                codCell.setCellValue(r.getCodAmount());
                codCell.setCellStyle(moneyStyle);

                // Phí ship
                Cell feeCell = row.createCell(colIdx++);
                feeCell.setCellValue(r.getShippingFee());
                feeCell.setCellStyle(moneyStyle);

                // Thực nhận
                Cell netCell = row.createCell(colIdx++);
                netCell.setCellValue(r.getNetAmount());
                netCell.setCellStyle(moneyStyle);

                if (isAdmin) {
                    // Trạng thái
                    row.createCell(colIdx++).setCellValue(r.getStatus());
                }
            }

            // Auto Sum Row
            org.apache.poi.ss.usermodel.Row footerRow = sheet.createRow(rowIdx);
            Cell labelCell = footerRow.createCell(0);
            labelCell.setCellValue("TỔNG CỘNG");
            // Let's just create a bold style for the label too
            CellStyle boldStyle = workbook.createCellStyle();
            boldStyle.setFont(boldFont);
            labelCell.setCellStyle(boldStyle);

            int netColIdx = isAdmin ? 6 : 5;
            Cell sumCell = footerRow.createCell(netColIdx);
            String colLetter = org.apache.poi.ss.util.CellReference.convertNumToColString(netColIdx);
            sumCell.setCellFormula("SUM(" + colLetter + "2:" + colLetter + rowIdx + ")");
            sumCell.setCellStyle(boldMoneyStyle);

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    public byte[] exportToPdf(List<CodReportRow> rows, String title) throws DocumentException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);

        document.open();

        com.lowagie.text.Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        fontTitle.setSize(18);
        Paragraph para = new Paragraph(title, fontTitle);
        para.setAlignment(Element.ALIGN_CENTER);
        document.add(para);
        document.add(Chunk.NEWLINE);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);

        addTableHeader(table);

        for (CodReportRow r : rows) {
            table.addCell(r.getOrderCode());
            table.addCell(r.getDeliveredDate() != null ? r.getDeliveredDate().toString().substring(0, 10) : "");
            table.addCell(String.format("%,.0f đ", r.getCodAmount()));
            table.addCell(String.format("%,.0f đ", r.getShippingFee()));
            table.addCell(String.format("%,.0f đ", r.getNetAmount()));
            table.addCell(r.getStatus());
        }

        document.add(table);
        document.close();

        return out.toByteArray();
    }

    private void addTableHeader(PdfPTable table) {
        String[] headers = { "Code", "Date", "COD", "Fee", "Net", "Status" };
        for (String h : headers) {
            PdfPCell cell = new PdfPCell();
            cell.setBackgroundColor(java.awt.Color.LIGHT_GRAY);
            cell.setPadding(5);
            cell.setPhrase(new Phrase(h));
            table.addCell(cell);
        }
    }
}
