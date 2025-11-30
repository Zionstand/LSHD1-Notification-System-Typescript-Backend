// Check screenings status in database
// Usage: node check-patients.js

const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkScreenings() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lshd1_screening',
  });

  console.log('Connected to database\n');

  try {
    // Check all statuses
    const [statuses] = await connection.query(`
      SELECT status, COUNT(*) as count
      FROM screenings
      GROUP BY status
    `);

    console.log('Screening statuses:');
    console.table(statuses);

    // Check recent screenings with vitals
    const [withVitals] = await connection.query(`
      SELECT id, status, blood_pressure_systolic, blood_pressure_diastolic, screening_type
      FROM screenings
      WHERE blood_pressure_systolic IS NOT NULL
      ORDER BY id DESC
      LIMIT 10
    `);

    console.log('\nRecent screenings with vitals recorded:');
    console.table(withVitals);

    // Check if any have vitals but still pending
    const [pendingWithVitals] = await connection.query(`
      SELECT id, status, blood_pressure_systolic, blood_pressure_diastolic
      FROM screenings
      WHERE blood_pressure_systolic IS NOT NULL
      AND status = 'pending'
    `);

    if (pendingWithVitals.length > 0) {
      console.log('\n⚠️  Found screenings with vitals but still PENDING status:');
      console.table(pendingWithVitals);

      console.log('\nFixing these to in_progress...');
      await connection.query(`
        UPDATE screenings
        SET status = 'in_progress'
        WHERE blood_pressure_systolic IS NOT NULL
        AND status = 'pending'
      `);
      console.log('Fixed!');
    } else {
      console.log('\n✅ No screenings with vitals stuck in pending status');
    }

    // Fix empty status screenings
    const [emptyStatus] = await connection.query(`
      SELECT id, status, blood_pressure_systolic
      FROM screenings
      WHERE status = '' OR status IS NULL
    `);

    if (emptyStatus.length > 0) {
      console.log('\n⚠️  Found screenings with EMPTY status:');
      console.table(emptyStatus);

      // Fix those with vitals to in_progress
      const [fix1] = await connection.query(`
        UPDATE screenings
        SET status = 'in_progress'
        WHERE (status = '' OR status IS NULL)
        AND blood_pressure_systolic IS NOT NULL
      `);
      console.log('Fixed', fix1.affectedRows, 'to in_progress');

      // Fix remaining to pending
      const [fix2] = await connection.query(`
        UPDATE screenings
        SET status = 'pending'
        WHERE status = '' OR status IS NULL
      `);
      console.log('Fixed', fix2.affectedRows, 'to pending');
    } else {
      console.log('\n✅ No screenings with empty status');
    }

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkScreenings();
