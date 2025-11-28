-- Add doctor assessment fields to screenings table
-- Run this migration: mysql -u root -p lshd1_screening_db < migrations/add_doctor_assessment_fields.sql

ALTER TABLE screenings
ADD COLUMN patient_status VARCHAR(50) NULL AFTER next_appointment,
ADD COLUMN referral_facility VARCHAR(255) NULL AFTER patient_status,
ADD COLUMN doctor_id INT NULL AFTER referral_facility,
ADD COLUMN doctor_assessed_at DATETIME NULL AFTER doctor_id;

-- Add index for doctor queries
CREATE INDEX idx_screenings_doctor_id ON screenings(doctor_id);
CREATE INDEX idx_screenings_patient_status ON screenings(patient_status);
