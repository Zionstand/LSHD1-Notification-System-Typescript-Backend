-- Migration: Add new patient fields for updated registration form
-- Run this script against your MySQL database to add the new columns
-- Execute each ALTER TABLE separately to handle cases where column already exists

-- Add full_name column (nullable to support existing records)
-- If column already exists, this will fail silently - that's ok
ALTER TABLE patients ADD COLUMN full_name VARCHAR(200) NULL;

-- Add age column (nullable to support existing records)
ALTER TABLE patients ADD COLUMN age INT NULL;

-- Add next_of_kin column (nullable to support existing records)
ALTER TABLE patients ADD COLUMN next_of_kin VARCHAR(150) NULL;

-- Add next_of_kin_phone column (nullable to support existing records)
ALTER TABLE patients ADD COLUMN next_of_kin_phone VARCHAR(20) NULL;

-- Update existing records: populate full_name from first_name and last_name
UPDATE patients
SET full_name = TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, '')))
WHERE full_name IS NULL OR full_name = '';

-- Update existing records: calculate age from date_of_birth
UPDATE patients
SET age = TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE())
WHERE age IS NULL AND date_of_birth IS NOT NULL;

-- Update existing records: copy emergency_contact to next_of_kin if available
UPDATE patients
SET next_of_kin = emergency_contact
WHERE (next_of_kin IS NULL OR next_of_kin = '') AND emergency_contact IS NOT NULL;

-- Update existing records: copy emergency_phone to next_of_kin_phone if available
UPDATE patients
SET next_of_kin_phone = emergency_phone
WHERE (next_of_kin_phone IS NULL OR next_of_kin_phone = '') AND emergency_phone IS NOT NULL;
