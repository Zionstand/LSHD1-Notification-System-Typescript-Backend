const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  console.log('Connecting to database...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lshd1_screening',
  });

  try {
    console.log('Connected! Running security features migration...\n');

    // 1. Add account lockout columns to users table
    console.log('1. Adding account lockout columns to users table...');

    // Check if columns exist first
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
    `, [process.env.DB_NAME || 'lshd1_screening']);

    const existingColumns = columns.map(c => c.COLUMN_NAME);

    if (!existingColumns.includes('failed_login_attempts')) {
      await connection.query(`ALTER TABLE users ADD COLUMN failed_login_attempts INT DEFAULT 0`);
      console.log('   - Added failed_login_attempts column');
    } else {
      console.log('   - failed_login_attempts column already exists');
    }

    if (!existingColumns.includes('locked_until')) {
      await connection.query(`ALTER TABLE users ADD COLUMN locked_until DATETIME NULL`);
      console.log('   - Added locked_until column');
    } else {
      console.log('   - locked_until column already exists');
    }

    if (!existingColumns.includes('last_login_at')) {
      await connection.query(`ALTER TABLE users ADD COLUMN last_login_at DATETIME NULL`);
      console.log('   - Added last_login_at column');
    } else {
      console.log('   - last_login_at column already exists');
    }

    // 2. Create audit_logs table
    console.log('\n2. Creating audit_logs table...');

    const [tables] = await connection.query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'audit_logs'
    `, [process.env.DB_NAME || 'lshd1_screening']);

    if (tables.length === 0) {
      await connection.query(`
        CREATE TABLE audit_logs (
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
        )
      `);
      console.log('   - Created audit_logs table');
    } else {
      console.log('   - audit_logs table already exists');
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('\nNew features enabled:');
    console.log('  - Account lockout after 5 failed login attempts');
    console.log('  - 15-minute lockout duration');
    console.log('  - Last login tracking');
    console.log('  - Audit logging for all user actions');

  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

runMigration().catch(console.error);
