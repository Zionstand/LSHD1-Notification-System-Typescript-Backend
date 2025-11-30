-- Migration: Create SMS Logs Table
-- Description: Table to store SMS notification history for tracking and auditing

CREATE TABLE IF NOT EXISTS `sms_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patient_id` int(11) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `message` text NOT NULL,
  `sms_type` enum('screening_result', 'followup_scheduled', 'appointment_reminder', 'manual') NOT NULL,
  `status` enum('pending', 'sent', 'delivered', 'failed') NOT NULL DEFAULT 'pending',
  `sendchamp_message_id` varchar(100) DEFAULT NULL,
  `sendchamp_response` text DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `screening_id` int(11) DEFAULT NULL,
  `appointment_id` int(11) DEFAULT NULL,
  `sent_by` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sent_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_sms_logs_patient_id` (`patient_id`),
  KEY `idx_sms_logs_status` (`status`),
  KEY `idx_sms_logs_sms_type` (`sms_type`),
  KEY `idx_sms_logs_created_at` (`created_at`),
  KEY `idx_sms_logs_screening_id` (`screening_id`),
  KEY `idx_sms_logs_appointment_id` (`appointment_id`),
  KEY `idx_sms_logs_sent_by` (`sent_by`),
  CONSTRAINT `fk_sms_logs_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sms_logs_screening` FOREIGN KEY (`screening_id`) REFERENCES `screenings` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sms_logs_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_sms_logs_user` FOREIGN KEY (`sent_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index for efficient queries on reminder processing
CREATE INDEX IF NOT EXISTS `idx_sms_logs_type_status` ON `sms_logs` (`sms_type`, `status`);
