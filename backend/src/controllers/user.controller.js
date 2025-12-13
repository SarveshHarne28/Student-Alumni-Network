// src/controllers/user.controller.js
const pool = require('../../config/db');

// Search users by name or email
exports.searchUsers = async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' });
  }

  try {
    const searchTerm = `%${q.trim()}%`;
    
    const [users] = await pool.query(`
      SELECT 
        u.user_id, 
        u.email, 
        u.role,
        COALESCE(s.name, a.name) as name,
        a.position,
        s.major,
        c.name as company_name
      FROM users u
      LEFT JOIN student_profiles s ON u.user_id = s.user_id
      LEFT JOIN alumni_profiles a ON u.user_id = a.user_id
      LEFT JOIN companies c ON a.company_id = c.company_id
      WHERE (s.name LIKE ? OR a.name LIKE ? OR u.email LIKE ?)
        AND u.verified = 1
      ORDER BY 
        CASE 
          WHEN s.name LIKE ? OR a.name LIKE ? THEN 1
          WHEN u.email LIKE ? THEN 2
          ELSE 3
        END
      LIMIT 20
    `, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]);

    res.json(users);
  } catch (err) {
    console.error('Search users error:', err);
    res.status(500).json({ error: 'Failed to search users' });
  }
};

// Get all users (for browsing)
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT 
        u.user_id, 
        u.email, 
        u.role,
        COALESCE(s.name, a.name) as name,
        a.position,
        s.major,
        c.name as company_name
      FROM users u
      LEFT JOIN student_profiles s ON u.user_id = s.user_id
      LEFT JOIN alumni_profiles a ON u.user_id = a.user_id
      LEFT JOIN companies c ON a.company_id = c.company_id
      WHERE u.verified = 1
      ORDER BY u.created_at DESC
      LIMIT 50
    `);

    res.json(users);
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};