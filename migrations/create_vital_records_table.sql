-- Create vital_records table for storing multiple vital sign recordings per patient/screening
-- Run this migration: mysql -u your_user -p your_database < migrations/create_vital_records_table.sql

CREATE TABLE IF NOT EXISTS `vital_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `screening_id` int DEFAULT NULL,
  `blood_pressure_systolic` int DEFAULT NULL,
  `blood_pressure_diastolic` int DEFAULT NULL,
  `temperature` decimal(4,1) DEFAULT NULL,
  `pulse_rate` int DEFAULT NULL,
  `respiratory_rate` int DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `bmi` decimal(4,2) DEFAULT NULL,
  `blood_sugar_random` decimal(5,2) DEFAULT NULL,
  `blood_sugar_fasting` decimal(5,2) DEFAULT NULL,
  `oxygen_saturation` int DEFAULT NULL,
  `notes` text,
  `recorded_by` int NOT NULL,
  `recorded_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_vital_records_patient` (`patient_id`),
  KEY `idx_vital_records_screening` (`screening_id`),
  KEY `idx_vital_records_recorded_at` (`recorded_at`),
  KEY `idx_vital_records_recorded_by` (`recorded_by`),
  CONSTRAINT `fk_vital_records_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vital_records_screening` FOREIGN KEY (`screening_id`) REFERENCES `screenings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_vital_records_user` FOREIGN KEY (`recorded_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add comment to describe the table
ALTER TABLE `vital_records` COMMENT = 'Stores multiple vital sign recordings per patient, allowing nurses and clinical staff to record vitals more than once';
