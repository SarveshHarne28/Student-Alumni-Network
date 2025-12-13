// src/controllers/auth.controller.js
const pool = require('../../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { sendWelcomeEmail } = require("../utils/email"); // ✅ NEW import

// Update the validation schemas
const STUDENT_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().max(255).required(),
  phone: Joi.string().max(20).allow(null, ''),
  graduation_year: Joi.number().integer().min(1900).max(2100).required(),
  major: Joi.string().max(100).allow('', null),
  cgpa: Joi.number().precision(2).min(0).max(10).allow(null),
  bio: Joi.string().allow('', null),
  github_url: Joi.string().uri().allow('', null),
  linkedin_url: Joi.string().uri().allow('', null),
  portfolio_url: Joi.string().uri().allow('', null),
  skills: Joi.array().items(Joi.string()).default([]),
  certifications: Joi.array().items(Joi.string()).default([]),
  projects: Joi.array().items(Joi.string()).default([])
});

const ALUMNI_SCHEMA = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().max(255).required(),
  phone: Joi.string().max(20).allow(null, ''),
  company_name: Joi.string().max(255).allow(null, ''),
  position: Joi.string().max(100).allow(null, ''),
  graduation_year: Joi.number().integer().min(1900).max(2100).required(),
  bio: Joi.string().allow('', null),
  linkedin_url: Joi.string().uri().allow('', null),
  github_url: Joi.string().uri().allow('', null),
  experience: Joi.array().items(Joi.object({
    company: Joi.string().required(),
    role: Joi.string().required(),
    duration: Joi.string().required(),
    description: Joi.string().allow('', null)
  })).default([]),
  education: Joi.array().items(Joi.object({
    degree: Joi.string().required(),
    institution: Joi.string().required(),
    year: Joi.string().required(),
    grade: Joi.string().allow('', null)
  })).default([]),
  certifications: Joi.array().items(Joi.string()).default([]),
  skills: Joi.array().items(Joi.string()).default([])
});

function signToken(user) {
  return jwt.sign(
    { user_id: user.user_id, role: user.role, verified: !!user.verified },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Helper: get or create company by name (case-insensitive simple approach)
async function getOrCreateCompany(conn, companyName) {
  if (!companyName) return null;
  const trimmed = companyName.trim();
  if (!trimmed) return null;

  // try find exact match (case-insensitive)
  const [rows] = await conn.query('SELECT company_id FROM companies WHERE LOWER(name) = LOWER(?) LIMIT 1', [trimmed]);
  if (rows.length > 0) return rows[0].company_id;

  // insert and return id
  const [resInsert] = await conn.query('INSERT INTO companies (name) VALUES (?)', [trimmed]);
  return resInsert.insertId;
}

// Register student (students are auto-verified)
exports.registerStudent = async (req, res) => {
  const { error, value } = STUDENT_SCHEMA.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const {
    email, password, name, phone, graduation_year, major, cgpa,
    bio, github_url, linkedin_url, portfolio_url,
    skills, certifications, projects
  } = value;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    
    const [exists] = await conn.query('SELECT 1 FROM users WHERE email = ? LIMIT 1', [email]);
    if (exists.length > 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [r] = await conn.query(
      'INSERT INTO users (email, password_hash, role, verified) VALUES (?, ?, "student", 1)',
      [email, hash]
    );
    const userId = r.insertId;

    await conn.query(
      `INSERT INTO student_profiles 
        (user_id, name, phone, graduation_year, major, cgpa, bio, github_url, linkedin_url, portfolio_url, skills, certifications, projects)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name,
        phone || null,
        graduation_year,
        major || null,
        cgpa || null,
        bio || '',
        github_url || '',
        linkedin_url || '',
        portfolio_url || '',
        JSON.stringify(skills || []),
        JSON.stringify(certifications || []),
        JSON.stringify(projects || [])
      ]
    );

    await conn.commit();

    return res.status(201).json({ message: 'Student registered successfully', user_id: userId });
  } catch (err) {
    await conn.rollback();
    console.error('Student registration error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  } finally {
    conn.release();
  }
};

// Register alumni (alumni require admin verification)
exports.registerAlumni = async (req, res) => {
  const { error, value } = ALUMNI_SCHEMA.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const {
    email, password, name, phone, company_name, position, graduation_year,
    bio, linkedin_url, github_url, experience, education, certifications, skills
  } = value;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [exists] = await conn.query('SELECT 1 FROM users WHERE email = ? LIMIT 1', [email]);
    if (exists.length > 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [r] = await conn.query(
      'INSERT INTO users (email, password_hash, role, verified) VALUES (?, ?, "alumni", 0)',
      [email, hash]
    );
    const userId = r.insertId;

    const companyId = await getOrCreateCompany(conn, company_name);

    await conn.query(
      `INSERT INTO alumni_profiles 
        (user_id, name, phone, company_id, position, graduation_year, bio, linkedin_url, github_url, 
         experience, education, certifications, skills)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        name,
        phone || null,
        companyId,
        position || null,
        graduation_year,
        bio || '',
        linkedin_url || '',
        github_url || '',
        JSON.stringify(experience || []),
        JSON.stringify(education || []),
        JSON.stringify(certifications || []),
        JSON.stringify(skills || [])
      ]
    );

    await conn.commit();

    return res.status(201).json({ message: 'Alumni registered (pending admin verification)', user_id: userId });
  } catch (err) {
    await conn.rollback();
    console.error('Alumni registration error:', err);
    return res.status(500).json({ error: 'Registration failed' });
  } finally {
    conn.release();
  }
};

// Login (students auto-verified can login, alumni requires verified=1)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const [rows] = await pool.query(
      'SELECT user_id, email, password_hash, role, verified FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    if (rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    // Enforce verification for alumni only
    if (user.role === 'alumni' && !user.verified) {
      return res.status(403).json({ error: 'Account not verified by admin yet' });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { user_id: user.user_id, email: user.email, role: user.role, verified: !!user.verified }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

// In auth.controller.js - replace the getProfile function
exports.getProfile = async (req, res) => {
  try {
    const { user_id, role } = req.user;

    console.log('🔍 Fetching profile for user:', user_id, 'role:', role);

    const [users] = await pool.query('SELECT user_id, email, role, verified FROM users WHERE user_id = ? LIMIT 1', [user_id]);
    if (users.length === 0) return res.status(404).json({ error: 'User not found' });

    let profile = {};
    
    if (role === 'student') {
      // Use try-catch to handle missing columns gracefully
      try {
        const [rows] = await pool.query(
          `SELECT name, phone, graduation_year, major, cgpa, 
                  COALESCE(bio, '') as bio, 
                  COALESCE(skills, '[]') as skills, 
                  COALESCE(certifications, '[]') as certifications, 
                  COALESCE(projects, '[]') as projects, 
                  COALESCE(github_url, '') as github_url, 
                  COALESCE(linkedin_url, '') as linkedin_url, 
                  COALESCE(portfolio_url, '') as portfolio_url 
           FROM student_profiles WHERE user_id = ? LIMIT 1`,
          [user_id]
        );
        
        if (rows.length > 0) {
          profile = rows[0];
          // Safely parse JSON fields
          try {
            if (profile.skills) profile.skills = JSON.parse(profile.skills);
            if (profile.certifications) profile.certifications = JSON.parse(profile.certifications);
            if (profile.projects) profile.projects = JSON.parse(profile.projects);
          } catch (parseError) {
            console.log('⚠️ JSON parse error, using empty arrays');
            profile.skills = [];
            profile.certifications = [];
            profile.projects = [];
          }
        }
      } catch (dbError) {
        console.log('⚠️ Database schema issue, fetching basic student data');
        // Fallback to basic query without new columns
        const [rows] = await pool.query(
          `SELECT name, phone, graduation_year, major, cgpa 
           FROM student_profiles WHERE user_id = ? LIMIT 1`,
          [user_id]
        );
        if (rows.length > 0) {
          profile = rows[0];
          profile.bio = '';
          profile.skills = [];
          profile.certifications = [];
          profile.projects = [];
          profile.github_url = '';
          profile.linkedin_url = '';
          profile.portfolio_url = '';
        }
      }
      
    } else if (role === 'alumni') {
      // Use try-catch to handle missing columns gracefully
      try {
        const [rows] = await pool.query(
          `SELECT a.name, a.phone, a.position, a.graduation_year, a.company_id, 
                  COALESCE(a.bio, '') as bio, 
                  COALESCE(a.experience, '[]') as experience, 
                  COALESCE(a.education, '[]') as education, 
                  COALESCE(a.certifications, '[]') as certifications, 
                  COALESCE(a.skills, '[]') as skills,
                  COALESCE(a.linkedin_url, '') as linkedin_url, 
                  COALESCE(a.github_url, '') as github_url,
                  c.name AS company_name
           FROM alumni_profiles a
           LEFT JOIN companies c ON a.company_id = c.company_id
           WHERE a.user_id = ? LIMIT 1`,
          [user_id]
        );
        
        if (rows.length > 0) {
          profile = rows[0];
          // Safely parse JSON fields
          try {
            if (profile.experience) profile.experience = JSON.parse(profile.experience);
            if (profile.education) profile.education = JSON.parse(profile.education);
            if (profile.certifications) profile.certifications = JSON.parse(profile.certifications);
            if (profile.skills) profile.skills = JSON.parse(profile.skills);
          } catch (parseError) {
            console.log('⚠️ JSON parse error, using empty arrays');
            profile.experience = [];
            profile.education = [];
            profile.certifications = [];
            profile.skills = [];
          }
        }
      } catch (dbError) {
        console.log('⚠️ Database schema issue, fetching basic alumni data');
        // Fallback to basic query without new columns
        const [rows] = await pool.query(
          `SELECT a.name, a.phone, a.position, a.graduation_year, a.company_id,
                  c.name AS company_name
           FROM alumni_profiles a
           LEFT JOIN companies c ON a.company_id = c.company_id
           WHERE a.user_id = ? LIMIT 1`,
          [user_id]
        );
        if (rows.length > 0) {
          profile = rows[0];
          profile.bio = '';
          profile.experience = [];
          profile.education = [];
          profile.certifications = [];
          profile.skills = [];
          profile.linkedin_url = '';
          profile.github_url = '';
        }
      }
    }

    console.log('✅ Profile fetched successfully');
    return res.json({ ...users[0], ...profile });
    
  } catch (err) {
    console.error('❌ Profile error:', err);
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
};