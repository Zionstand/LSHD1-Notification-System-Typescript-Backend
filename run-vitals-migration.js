// Run this script to create the vital_records table
// Usage: node run-vitals-migration.js

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function runMigration() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lshd1_screening',
    multipleStatements: true,
  });

  console.log('Connected to database');

  try {
    // Check if table already exists
    const [tables] = await connection.query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'vital_records'
    `);

    if (tables.length > 0) {
      console.log('Table vital_records already exists!');
      return;
    }

    // Read and run the migration file
    const migrationPath = path.join(__dirname, 'migrations', 'create_vital_records_table.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Running migration: create_vital_records_table.sql');
    await connection.query(sql);

    console.log('Migration successful! Created vital_records table.');

    // Verify the table was created
    const [newTables] = await connection.query(`
      SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'vital_records'
    `);

    if (newTables.length > 0) {
      console.log('Verified: vital_records table exists.');
    }

  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

runMigration();
