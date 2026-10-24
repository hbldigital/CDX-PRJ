-- CODELIX Platform Database Schema for cPanel MySQL / MariaDB
-- Import this SQL file into your cPanel phpMyAdmin database

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `phone` VARCHAR(50) DEFAULT '',
  `country` VARCHAR(80) DEFAULT 'Pakistan',
  `role` ENUM('customer', 'employee', 'admin') DEFAULT 'customer',
  `password_hash` VARCHAR(255) NOT NULL,
  `is_verified` TINYINT(1) DEFAULT 0,
  `verification_code` VARCHAR(20) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Services Table
CREATE TABLE IF NOT EXISTS `services` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `short_description` TEXT,
  `full_description` LONGTEXT,
  `starting_price` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Pakistani Banks Table
CREATE TABLE IF NOT EXISTS `pakistani_banks` (
  `id` VARCHAR(64) PRIMARY KEY,
  `bank_name` VARCHAR(150) NOT NULL,
  `account_title` VARCHAR(150) NOT NULL,
  `account_number` VARCHAR(80) NOT NULL,
  `iban` VARCHAR(80) DEFAULT '',
  `branch_code` VARCHAR(30) DEFAULT '',
  `category` VARCHAR(60) DEFAULT 'Commercial Bank',
  `instructions` TEXT,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Crypto Wallets Table
CREATE TABLE IF NOT EXISTS `crypto_wallets` (
  `id` VARCHAR(64) PRIMARY KEY,
  `symbol` VARCHAR(30) NOT NULL,
  `network` VARCHAR(80) NOT NULL,
  `wallet_address` VARCHAR(255) NOT NULL,
  `instructions` TEXT,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` VARCHAR(64) PRIMARY KEY,
  `reference` VARCHAR(60) NOT NULL UNIQUE,
  `customer_id` VARCHAR(64) DEFAULT 'guest',
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_email` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(50) DEFAULT '',
  `subtotal` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `discount` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `amount_in_usd` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `payment_method_type` VARCHAR(30) DEFAULT 'bank',
  `selected_bank_name` VARCHAR(150) DEFAULT '',
  `selected_crypto_network` VARCHAR(100) DEFAULT '',
  `transaction_id` VARCHAR(150) DEFAULT '',
  `status` VARCHAR(60) DEFAULT 'Pending Review',
  `payment_status` VARCHAR(60) DEFAULT 'Verification in Progress',
  `customer_remarks` TEXT,
  `business_name` VARCHAR(150) DEFAULT '',
  `website_url` VARCHAR(255) DEFAULT '',
  `overall_progress` INT DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Coupons Table
CREATE TABLE IF NOT EXISTS `coupons` (
  `id` VARCHAR(64) PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE,
  `title` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `discount_type` ENUM('percentage', 'fixed') DEFAULT 'percentage',
  `discount_value` DECIMAL(10,2) NOT NULL DEFAULT 10.00,
  `min_order` DECIMAL(12,2) DEFAULT 0.00,
  `expiry_date` DATE DEFAULT '2026-12-31',
  `is_exclusive` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Seed Data: Admin and Seed Customers
INSERT INTO `users` (`id`, `name`, `email`, `role`, `password_hash`, `is_verified`) VALUES
('usr-admin', 'Aaqib Hussain (CEO)', 'admin@codelix.online', 'admin', 'admin123', 1),
('usr-emp-1', 'Zubair Shah (Lead)', 'zubair@codelix.online', 'employee', 'employee123', 1),
('usr-cust-1', 'Hamza Khan', 'hamza.client@example.com', 'customer', 'client123', 1)
ON DUPLICATE KEY UPDATE `email`=`email`;

-- Initial Seed Coupons
INSERT INTO `coupons` (`id`, `code`, `title`, `discount_type`, `discount_value`, `min_order`, `is_exclusive`, `is_active`) VALUES
('cpn-welcome', 'WELCOME10', 'Mailing List 10% Voucher', 'percentage', 10.00, 0, 0, 1),
('cpn-codelix', 'CODELIX10', 'New Client Promotional Discount', 'percentage', 10.00, 0, 0, 1),
('cpn-launch', 'LAUNCH5000', 'Enterprise Launch Voucher', 'fixed', 5000.00, 20000.00, 0, 1)
ON DUPLICATE KEY UPDATE `code`=`code`;

SET FOREIGN_KEY_CHECKS = 1;
