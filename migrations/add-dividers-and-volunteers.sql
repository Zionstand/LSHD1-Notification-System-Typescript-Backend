-- Migration: Add Dividers and Volunteers tables for CHO functionality
-- Date: 2024-12-03

-- Create Dividers table
CREATE TABLE IF NOT EXISTS `dividers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `divider_code` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(20) NULL,
  `address` VARCHAR(255) NULL,
  `lga` VARCHAR(100) NULL,
  `ward` VARCHAR(100) NULL,
  `community` VARCHAR(100) NULL,
  `notes` TEXT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'active',
  `phc_center_id` INT NULL,
  `captured_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`phc_center_id`) REFERENCES `phc_centers`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`captured_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  INDEX `idx_dividers_status` (`status`),
  INDEX `idx_dividers_phc_center` (`phc_center_id`),
  INDEX `idx_dividers_code` (`divider_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Volunteers table
CREATE TABLE IF NOT EXISTS `volunteers` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `volunteer_code` VARCHAR(50) NOT NULL UNIQUE,
  `full_name` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `alt_phone` VARCHAR(20) NULL,
  `email` VARCHAR(255) NULL,
  `gender` VARCHAR(10) NOT NULL,
  `age` INT NULL,
  `date_of_birth` DATE NULL,
  `address` VARCHAR(255) NULL,
  `lga` VARCHAR(100) NULL,
  `ward` VARCHAR(100) NULL,
  `community` VARCHAR(100) NULL,
  `occupation` VARCHAR(255) NULL,
  `education_level` VARCHAR(100) NULL,
  `next_of_kin` VARCHAR(255) NULL,
  `next_of_kin_phone` VARCHAR(20) NULL,
  `skills` TEXT NULL,
  `training_completed` TINYINT NOT NULL DEFAULT 0,
  `training_date` DATE NULL,
  `notes` TEXT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'pending',
  `phc_center_id` INT NULL,
  `registered_by` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`phc_center_id`) REFERENCES `phc_centers`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`registered_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
  INDEX `idx_volunteers_status` (`status`),
  INDEX `idx_volunteers_phc_center` (`phc_center_id`),
  INDEX `idx_volunteers_code` (`volunteer_code`),
  INDEX `idx_volunteers_training` (`training_completed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment describing the purpose of these tables
-- Dividers: Used by CHO to capture divider information in the community
-- Volunteers: Used by CHO to register and manage community health volunteers
