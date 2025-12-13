// createAdmin.js
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function createAdmin() {
  try {
    const email = 'admin@jnec.ac.in';
    const plainPassword = 'Admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    const [result] = await pool.query(
      'INSERT INTO users (email, password_hash, role, verified) VALUES (?, ?, "admin", 1)',
      [email, hashedPassword]
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@jnec.ac.in');
    console.log('Password: Admin123');
    console.log('User ID:', result.insertId);
    
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log('ℹ️ Admin user already exists');
    } else {
      console.error('❌ Error creating admin:', error.message);
    }
  } finally {
    process.exit();
  }
}

createAdmin();