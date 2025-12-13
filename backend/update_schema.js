// update_schema.js
const pool = require('./config/db');

async function updateSchema() {
  try {
    console.log('🔄 Updating database schema...');
    
    // Add columns to student_profiles
    await pool.query(`
      ALTER TABLE student_profiles 
      ADD COLUMN bio TEXT,
      ADD COLUMN skills JSON,
      ADD COLUMN certifications JSON,
      ADD COLUMN projects JSON,
      ADD COLUMN github_url VARCHAR(255),
      ADD COLUMN linkedin_url VARCHAR(255),
      ADD COLUMN portfolio_url VARCHAR(255)
    `);
    console.log('✅ Added columns to student_profiles');
    
    // Add columns to alumni_profiles
    await pool.query(`
      ALTER TABLE alumni_profiles 
      ADD COLUMN bio TEXT,
      ADD COLUMN experience JSON,
      ADD COLUMN education JSON,
      ADD COLUMN certifications JSON,
      ADD COLUMN skills JSON,
      ADD COLUMN linkedin_url VARCHAR(255),
      ADD COLUMN github_url VARCHAR(255)
    `);
    console.log('✅ Added columns to alumni_profiles');
    
    console.log('🎉 Database schema updated successfully!');
    process.exit(0);
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️ Columns already exist, skipping...');
      process.exit(0);
    } else {
      console.error('❌ Error updating schema:', error.message);
      process.exit(1);
    }
  }
}

updateSchema();