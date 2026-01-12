package com.example.backend.dto;

public class ShopProfileUpdateRequest {
    private String shopName;
    private String phone;
    private String address;
    private BankAccountInfo bankAccount;

    // Getters and Setters
    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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
