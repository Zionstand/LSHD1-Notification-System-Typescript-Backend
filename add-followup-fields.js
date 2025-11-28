const mysql = require('mysql2/promise');
require('dotenv').config();

async function addFollowupFields() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lshd1_screening',
  });

  console.log('Connected to database...');

  try {
    // Add new columns to appointments table for follow-up functionality
    const columns = [
      { name: 'screening_id', sql: 'ALTER TABLE appointments ADD COLUMN screening_id INT NULL AFTER phc_center_id' },
      { name: 'is_followup', sql: 'ALTER TABLE appointments ADD COLUMN is_followup TINYINT DEFAULT 0 AFTER reason' },
      { name: 'followup_instructions', sql: 'ALTER TABLE appointments ADD COLUMN followup_instructions TEXT NULL AFTER is_followup' },
      { name: 'send_sms_reminder', sql: 'ALTER TABLE appointments ADD COLUMN send_sms_reminder TINYINT DEFAULT 1 AFTER reminder_sent' },
      { name: 'reminder_days_before', sql: 'ALTER TABLE appointments ADD COLUMN reminder_days_before INT DEFAULT 1 AFTER send_sms_reminder' },
      { name: 'reminder_scheduled_date', sql: 'ALTER TABLE appointments ADD COLUMN reminder_scheduled_date DATE NULL AFTER reminder_days_before' },
    ];

    for (const col of columns) {
      try {
        await connection.execute(col.sql);
        console.log(`Added column: ${col.name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column ${col.name} already exists, skipping.`);
        } else {
          throw err;
        }
      }
    }

    // Add foreign key for screening_id if not exists
    try {
      await connection.execute(`
        ALTER TABLE appointments
        ADD CONSTRAINT fk_appointments_screening
        FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE SET NULL
      `);
      console.log('Added foreign key for screening_id');
    } catch (err) {
      if (err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_FK_DUP_NAME') {
        console.log('Foreign key already exists, skipping.');
      } else {
        console.log('Note: Could not add foreign key (may already exist):', err.message);
      }
    }

    console.log('\n=== Follow-up fields added successfully! ===');

  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

addFollowupFields()
  .then(() => {
    console.log('Migration completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
