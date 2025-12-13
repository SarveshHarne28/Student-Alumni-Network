// src/controllers/profile.controller.js
const pool = require('../../config/db');

// Helper function to safely parse JSON
const safeJsonParse = (str, defaultValue = []) => {
  if (!str) return defaultValue;
  if (typeof str === 'object') return str; // Already parsed
  
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch (err) {
    console.warn('JSON parse error for string:', str);
    return defaultValue;
  }
};

// Get user profile by ID (for profile viewing)
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    console.log('Fetching profile for user ID:', userId);

    // Get user role and basic info first
    const [userRows] = await pool.query(
      'SELECT user_id, email, role, verified FROM users WHERE user_id = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userRows[0];
    
    // Check if user is verified (alumni must be verified)
    if (user.role === 'alumni' && !user.verified) {
      return res.status(403).json({ error: 'Alumni profile not verified' });
    }

    let profile = { 
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      verified: user.verified
    };

    if (user.role === 'student') {
      const [studentRows] = await pool.query(
        `SELECT 
          name, phone, graduation_year, major, cgpa, bio,
          github_url, linkedin_url, portfolio_url,
          skills, certifications, projects
         FROM student_profiles 
         WHERE user_id = ?`,
        [userId]
      );
      
      if (studentRows.length > 0) {
        const student = studentRows[0];
        profile = {
          ...profile,
          name: student.name,
          phone: student.phone,
          graduation_year: student.graduation_year,
          major: student.major,
          cgpa: student.cgpa,
          bio: student.bio,
          github_url: student.github_url,
          linkedin_url: student.linkedin_url,
          portfolio_url: student.portfolio_url,
          skills: safeJsonParse(student.skills),
          certifications: safeJsonParse(student.certifications),
          projects: safeJsonParse(student.projects)
        };
      } else {
        return res.status(404).json({ error: 'Student profile not found' });
      }
    } else if (user.role === 'alumni') {
      const [alumniRows] = await pool.query(
        `SELECT 
          a.name, a.phone, a.position, a.graduation_year, 
          a.bio, a.linkedin_url, a.github_url,
          a.experience, a.education, a.certifications, a.skills,
          c.name as company_name
         FROM alumni_profiles a
         LEFT JOIN companies c ON a.company_id = c.company_id
         WHERE a.user_id = ?`,
        [userId]
      );
      
      if (alumniRows.length > 0) {
        const alumni = alumniRows[0];
        profile = {
          ...profile,
          name: alumni.name,
          phone: alumni.phone,
          company_name: alumni.company_name,
          position: alumni.position,
          graduation_year: alumni.graduation_year,
          bio: alumni.bio,
          linkedin_url: alumni.linkedin_url,
          github_url: alumni.github_url,
          experience: safeJsonParse(alumni.experience),
          education: safeJsonParse(alumni.education),
          certifications: safeJsonParse(alumni.certifications),
          skills: safeJsonParse(alumni.skills)
        };
      } else {
        return res.status(404).json({ error: 'Alumni profile not found' });
      }
    } else if (user.role === 'admin') {
      // Admin profile - minimal info
      profile = {
        ...profile,
        name: 'Administrator',
        role: 'admin'
      };
    }

    console.log('Profile fetched successfully for user:', userId);
    res.json(profile);
  } catch (err) {
    console.error('Get user profile error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// Update student profile
exports.updateStudentProfile = async (req, res) => {
  const {
    name, phone, graduation_year, major, cgpa, bio,
    github_url, linkedin_url, portfolio_url, skills, certifications, projects
  } = req.body;
  
  const userId = req.user.user_id;

  try {
    // First check if student profile exists
    const [existing] = await pool.query(
      'SELECT user_id FROM student_profiles WHERE user_id = ?',
      [userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    await pool.query(
      `UPDATE student_profiles SET 
        name = ?, phone = ?, graduation_year = ?, major = ?, cgpa = ?, bio = ?,
        github_url = ?, linkedin_url = ?, portfolio_url = ?, 
        skills = ?, certifications = ?, projects = ?
       WHERE user_id = ?`,
      [
        name, phone, graduation_year, major, cgpa, bio,
        github_url, linkedin_url, portfolio_url,
        JSON.stringify(skills || []),
        JSON.stringify(certifications || []),
        JSON.stringify(projects || []),
        userId
      ]
    );

    res.json({ message: 'Student profile updated successfully' });
  } catch (err) {
    console.error('Update student profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Update alumni profile
exports.updateAlumniProfile = async (req, res) => {
  const {
    name, phone, company_name, position, graduation_year, bio,
    linkedin_url, github_url, experience, education, certifications, skills
  } = req.body;
  
  const userId = req.user.user_id;

  const conn = await pool.getConnection();
  
  try {
    // First check if alumni profile exists
    const [existing] = await conn.query(
      'SELECT user_id FROM alumni_profiles WHERE user_id = ?',
      [userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Alumni profile not found' });
    }

    await conn.beginTransaction();

    // Get or create company
    let companyId = null;
    if (company_name) {
      const [companyRows] = await conn.query(
        'SELECT company_id FROM companies WHERE LOWER(name) = LOWER(?) LIMIT 1',
        [company_name]
      );
      
      if (companyRows.length > 0) {
        companyId = companyRows[0].company_id;
      } else {
        const [insertResult] = await conn.query(
          'INSERT INTO companies (name) VALUES (?)',
          [company_name]
        );
        companyId = insertResult.insertId;
      }
    }

    // Update alumni profile
    await conn.query(
      `UPDATE alumni_profiles SET 
        name = ?, phone = ?, company_id = ?, position = ?, graduation_year = ?, bio = ?,
        linkedin_url = ?, github_url = ?, 
        experience = ?, education = ?, certifications = ?, skills = ?
       WHERE user_id = ?`,
      [
        name, phone, companyId, position, graduation_year, bio,
        linkedin_url, github_url,
        JSON.stringify(experience || []),
        JSON.stringify(education || []),
        JSON.stringify(certifications || []),
        JSON.stringify(skills || []),
        userId
      ]
    );

    await conn.commit();
    res.json({ message: 'Alumni profile updated successfully' });
  } catch (err) {
    await conn.rollback();
    console.error('Update alumni profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  } finally {
    conn.release();
  }
};