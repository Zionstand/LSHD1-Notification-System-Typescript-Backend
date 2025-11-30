// Run this script to add 'in_progress' status to the screenings table
// Usage: node run-migration.js

const mysql = require('mysql2/promise');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lshd1_screening',
  });

  console.log('Connected to database');

  try {
    // Check current enum values
    const [columns] = await connection.query(`
      SELECT COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'screenings'
      AND COLUMN_NAME = 'status'
    `);

    console.log('Current status column type:', columns[0]?.COLUMN_TYPE);

    // Run the migration
    await connection.query(`
      ALTER TABLE screenings
      MODIFY COLUMN status ENUM('completed', 'pending', 'in_progress', 'follow_up') DEFAULT 'pending'
    `);

    console.log('Migration successful! Added in_progress to status enum.');

    // Verify the change
    const [newColumns] = await connection.query(`
      SELECT COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'screenings'
      AND COLUMN_NAME = 'status'
    `);

    console.log('New status column type:', newColumns[0]?.COLUMN_TYPE);

  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

runMigration();
