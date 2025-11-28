const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lshd1_screening_db',
  });

  console.log('Connected to database');

  try {
    // Check if columns already exist
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'screenings'
    `, [process.env.DB_NAME || 'lshd1_screening_db']);

    const existingColumns = columns.map(c => c.COLUMN_NAME);
    console.log('Existing columns:', existingColumns);

    // Add patient_status if not exists
    if (!existingColumns.includes('patient_status')) {
      console.log('Adding patient_status column...');
      await connection.execute(`
        ALTER TABLE screenings
        ADD COLUMN patient_status VARCHAR(50) NULL AFTER next_appointment
      `);
      console.log('patient_status column added');
    } else {
      console.log('patient_status column already exists');
    }

    // Add referral_facility if not exists
    if (!existingColumns.includes('referral_facility')) {
      console.log('Adding referral_facility column...');
      await connection.execute(`
        ALTER TABLE screenings
        ADD COLUMN referral_facility VARCHAR(255) NULL AFTER patient_status
      `);
      console.log('referral_facility column added');
    } else {
      console.log('referral_facility column already exists');
    }

    // Add doctor_id if not exists
    if (!existingColumns.includes('doctor_id')) {
      console.log('Adding doctor_id column...');
      await connection.execute(`
        ALTER TABLE screenings
        ADD COLUMN doctor_id INT NULL AFTER referral_facility
      `);
      console.log('doctor_id column added');
    } else {
      console.log('doctor_id column already exists');
    }

    // Add doctor_assessed_at if not exists
    if (!existingColumns.includes('doctor_assessed_at')) {
      console.log('Adding doctor_assessed_at column...');
      await connection.execute(`
        ALTER TABLE screenings
        ADD COLUMN doctor_assessed_at DATETIME NULL AFTER doctor_id
      `);
      console.log('doctor_assessed_at column added');
    } else {
      console.log('doctor_assessed_at column already exists');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await connection.end();
  }
}

runMigration();
