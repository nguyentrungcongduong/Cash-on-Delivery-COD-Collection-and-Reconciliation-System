package com.example.backend.dto;

public class ShopProfileResponse {
    private String shopName;
    private String shopCode;
    private String phone;
    private String email;
    private String address;
    private String createdAt;
    private BankAccountInfo bankAccount;

    public ShopProfileResponse(String shopName, String shopCode, String phone, String email, String address,
            String createdAt,
            BankAccountInfo bankAccount) {
        this.shopName = shopName;
        this.shopCode = shopCode;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.createdAt = createdAt;
        this.bankAccount = bankAccount;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getShopCode() {
        return shopCode;
    }

    public void setShopCode(String shopCode) {
        this.shopCode = shopCode;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public BankAccountInfo getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(BankAccountInfo bankAccount) {
        this.bankAccount = bankAccount;
    }

    public static class BankAccountInfo {
        private String bankName;
        private String accountNumber;
        private String accountHolder;
        private String branch;

        public BankAccountInfo(String bankName, String accountNumber, String accountHolder, String branch) {
            this.bankName = bankName;
            this.accountNumber = accountNumber;
            this.accountHolder = accountHolder;
            this.branch = branch;
        }

        public String getBankName() {
            return bankName;
        }

        public void setBankName(String bankName) {
            this.bankName = bankName;
        }

        public String getAccountNumber() {
            return accountNumber;
        }

        public void setAccountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
        }

        public String getAccountHolder() {
            return accountHolder;
        }

        public void setAccountHolder(String accountHolder) {
            this.accountHolder = accountHolder;
        }

        public String getBranch() {
            return branch;
        }

        public void setBranch(String branch) {
            this.branch = branch;
        }
    }
}
