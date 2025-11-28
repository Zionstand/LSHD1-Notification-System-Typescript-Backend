const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateUserRoles() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lshd1_screening_db',
  });

  console.log('Connected to database');

  try {
    // Step 1: First, update any existing 'lab_scientist' users to 'mls'
    console.log('Updating existing lab_scientist users to mls...');
    const [updateResult] = await connection.execute(`
      UPDATE users SET role = 'mls' WHERE role = 'lab_scientist'
    `);
    console.log(`Updated ${updateResult.affectedRows} users from lab_scientist to mls`);

    // Step 2: Modify the enum to include new roles
    console.log('Modifying role enum to include mls and cho...');
    await connection.execute(`
      ALTER TABLE users
      MODIFY COLUMN role ENUM('admin', 'him_officer', 'nurse', 'doctor', 'mls', 'cho') NOT NULL
    `);
    console.log('Role enum updated successfully');

    // Step 3: Verify the changes
    console.log('Verifying enum values...');
    const [columns] = await connection.execute(`
      SELECT COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = 'users'
        AND COLUMN_NAME = 'role'
    `, [process.env.DB_NAME || 'lshd1_screening_db']);

    if (columns.length > 0) {
      console.log('Current role enum:', columns[0].COLUMN_TYPE);
    }

    // Step 4: Show current role distribution
    const [roles] = await connection.execute(`
      SELECT role, COUNT(*) as count FROM users GROUP BY role
    `);
    console.log('Current user distribution by role:');
    roles.forEach(r => console.log(`  - ${r.role}: ${r.count} users`));

    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

updateUserRoles();
