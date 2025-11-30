-- Migration: Add security features (account lockout, audit logging)
-- Date: 2024

-- 1. Add account lockout columns to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until DATETIME NULL,
ADD COLUMN IF NOT EXISTS last_login_at DATETIME NULL;

-- 2. Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  action VARCHAR(50) NOT NULL,
  resource VARCHAR(50) NOT NULL,
  resource_id INT NULL,
  details TEXT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(500) NULL,
  facility_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_audit_user (user_id),
  INDEX idx_audit_action (action),
  INDEX idx_audit_resource (resource, resource_id),
  INDEX idx_audit_facility (facility_id),
  INDEX idx_audit_created (created_at),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Verify changes
SELECT 'Migration completed successfully' AS status;
