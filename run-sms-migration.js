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
    console.log('Connected! Running SMS module migration...\n');

    // 1. Create sms_logs table
    console.log('1. Creating sms_logs table...');

    const [tables] = await connection.query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'sms_logs'
    `, [process.env.DB_NAME || 'lshd1_screening']);

    if (tables.length === 0) {
      await connection.query(`
        CREATE TABLE sms_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          patient_id INT NULL,
          phone_number VARCHAR(20) NOT NULL,
          message TEXT NOT NULL,
          sms_type VARCHAR(50) NOT NULL,
          status VARCHAR(20) DEFAULT 'PENDING',
          sendchamp_reference VARCHAR(100) NULL,
          error_message TEXT NULL,
          sent_by INT NULL,
          facility_id INT NULL,
          related_entity VARCHAR(50) NULL,
          related_entity_id INT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          sent_at DATETIME NULL,

          INDEX idx_sms_patient (patient_id),
          INDEX idx_sms_type (sms_type),
          INDEX idx_sms_status (status),
          INDEX idx_sms_facility (facility_id),
          INDEX idx_sms_created (created_at),

          FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE SET NULL,
          FOREIGN KEY (sent_by) REFERENCES users(id) ON DELETE SET NULL
        )
      `);
      console.log('   - Created sms_logs table');
    } else {
      console.log('   - sms_logs table already exists');
    }

    // 2. Add SMS reminder columns to appointments table if not exists
    console.log('\n2. Adding SMS reminder columns to appointments table...');

    const [columns] = await connection.query(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'appointments'
    `, [process.env.DB_NAME || 'lshd1_screening']);

    const existingColumns = columns.map(c => c.COLUMN_NAME);

    if (!existingColumns.includes('send_sms_reminder')) {
      await connection.query(`ALTER TABLE appointments ADD COLUMN send_sms_reminder BOOLEAN DEFAULT TRUE`);
      console.log('   - Added send_sms_reminder column');
    } else {
      console.log('   - send_sms_reminder column already exists');
    }

    if (!existingColumns.includes('reminder_sent')) {
      await connection.query(`ALTER TABLE appointments ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE`);
      console.log('   - Added reminder_sent column');
    } else {
      console.log('   - reminder_sent column already exists');
    }

    if (!existingColumns.includes('reminder_days_before')) {
      await connection.query(`ALTER TABLE appointments ADD COLUMN reminder_days_before INT DEFAULT 1`);
      console.log('   - Added reminder_days_before column');
    } else {
      console.log('   - reminder_days_before column already exists');
    }

    console.log('\n✅ SMS Migration completed successfully!');
    console.log('\nNew features enabled:');
    console.log('  - SMS logging for all sent messages');
    console.log('  - Appointment reminder SMS tracking');
    console.log('  - Screening result SMS notifications');
    console.log('  - Follow-up reminder SMS');
    console.log('\nMake sure your .env file has:');
    console.log('  SENDCHAMP_BASE_URL=https://api.sendchamp.com/api/v1');
    console.log('  SENDCHAMP_API_KEY=your_api_key');
    console.log('  SENDCHAMP_SENDER_NAME=LSHD1');

  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

runMigration().catch(console.error);
