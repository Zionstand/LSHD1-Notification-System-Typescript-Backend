const mysql = require('mysql2/promise');
require('dotenv').config();

async function createScreeningTables() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lshd1_screening',
  });

  console.log('Connected to database...');

  try {
    // 1. Create hypertension_screenings table
    console.log('Creating hypertension_screenings table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS hypertension_screenings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        screening_id INT NOT NULL,
        systolic_bp_1 INT NOT NULL,
        diastolic_bp_1 INT NOT NULL,
        position_1 VARCHAR(20) NOT NULL,
        arm_used_1 VARCHAR(10) NOT NULL,
        systolic_bp_2 INT NULL,
        diastolic_bp_2 INT NULL,
        position_2 VARCHAR(20) NULL,
        arm_used_2 VARCHAR(10) NULL,
        systolic_bp_3 INT NULL,
        diastolic_bp_3 INT NULL,
        position_3 VARCHAR(20) NULL,
        arm_used_3 VARCHAR(10) NULL,
        screening_result VARCHAR(20) NOT NULL,
        clinical_observations TEXT NULL,
        recommendations TEXT NULL,
        refer_to_doctor TINYINT DEFAULT 0,
        referral_reason TEXT NULL,
        conducted_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE CASCADE,
        FOREIGN KEY (conducted_by) REFERENCES users(id)
      )
    `);
    console.log('hypertension_screenings table created.');

    // 2. Create diabetes_screenings table
    console.log('Creating diabetes_screenings table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS diabetes_screenings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        screening_id INT NOT NULL,
        test_type VARCHAR(20) NOT NULL,
        blood_sugar_level DECIMAL(5,2) NOT NULL,
        unit VARCHAR(10) DEFAULT 'mg/dL',
        fasting_duration_hours INT NULL,
        test_time TIME NOT NULL,
        screening_result VARCHAR(20) NOT NULL,
        clinical_observations TEXT NULL,
        refer_to_doctor TINYINT DEFAULT 0,
        referral_reason TEXT NULL,
        conducted_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE CASCADE,
        FOREIGN KEY (conducted_by) REFERENCES users(id)
      )
    `);
    console.log('diabetes_screenings table created.');

    // 3. Create cervical_screenings table
    console.log('Creating cervical_screenings table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS cervical_screenings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        screening_id INT NOT NULL,
        screening_performed TINYINT DEFAULT 1,
        screening_method VARCHAR(50) NOT NULL,
        other_method_details VARCHAR(100) NULL,
        visual_inspection_findings TEXT NULL,
        specimen_collected TINYINT DEFAULT 0,
        specimen_type VARCHAR(50) NULL,
        screening_result VARCHAR(20) NOT NULL,
        clinical_observations TEXT NULL,
        remarks TEXT NULL,
        follow_up_required TINYINT DEFAULT 0,
        follow_up_date DATE NULL,
        follow_up_notes TEXT NULL,
        conducted_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE CASCADE,
        FOREIGN KEY (conducted_by) REFERENCES users(id)
      )
    `);
    console.log('cervical_screenings table created.');

    // 4. Create breast_screenings table
    console.log('Creating breast_screenings table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS breast_screenings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        screening_id INT NOT NULL,
        lump_present TINYINT DEFAULT 0,
        lump_location VARCHAR(100) NULL,
        lump_size VARCHAR(50) NULL,
        lump_characteristics TEXT NULL,
        discharge_present TINYINT DEFAULT 0,
        discharge_type VARCHAR(50) NULL,
        discharge_location VARCHAR(20) NULL,
        nipple_inversion TINYINT DEFAULT 0,
        nipple_inversion_laterality VARCHAR(20) NULL,
        lymph_node_status VARCHAR(20) DEFAULT 'normal',
        lymph_node_location VARCHAR(100) NULL,
        skin_changes TEXT NULL,
        breast_symmetry VARCHAR(100) NULL,
        summary_findings TEXT NOT NULL,
        risk_assessment VARCHAR(20) NOT NULL,
        recommendations TEXT NULL,
        referral_required TINYINT DEFAULT 0,
        referral_facility VARCHAR(200) NULL,
        referral_reason TEXT NULL,
        conducted_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE CASCADE,
        FOREIGN KEY (conducted_by) REFERENCES users(id)
      )
    `);
    console.log('breast_screenings table created.');

    // 5. Create psa_screenings table
    console.log('Creating psa_screenings table...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS psa_screenings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        screening_id INT NOT NULL,
        psa_level DECIMAL(6,3) NOT NULL,
        unit VARCHAR(10) DEFAULT 'ng/mL',
        test_method VARCHAR(100) NULL,
        test_kit VARCHAR(100) NULL,
        collection_time TIME NOT NULL,
        sample_quality VARCHAR(50) DEFAULT 'adequate',
        sample_quality_notes TEXT NULL,
        patient_age INT NOT NULL,
        normal_range_min DECIMAL(5,2) DEFAULT 0,
        normal_range_max DECIMAL(5,2) NOT NULL,
        screening_result VARCHAR(20) NOT NULL,
        result_interpretation TEXT NULL,
        clinical_observations TEXT NULL,
        refer_to_doctor TINYINT DEFAULT 0,
        referral_reason TEXT NULL,
        conducted_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (screening_id) REFERENCES screenings(id) ON DELETE CASCADE,
        FOREIGN KEY (conducted_by) REFERENCES users(id)
      )
    `);
    console.log('psa_screenings table created.');

    console.log('\n=== All pathway screening tables created successfully! ===');

  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

createScreeningTables()
  .then(() => {
    console.log('Migration completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
