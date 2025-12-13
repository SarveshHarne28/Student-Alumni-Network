// src/controllers/applications.controller.js
const pool = require('../../config/db');
const sendEmail = require("../utils/email");

/**
 * Get all active opportunities (for students)
 */
exports.getAllOpportunities = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT o.opportunity_id, o.alumni_id, o.title, o.description, o.type, o.status,
              c.name AS company_name, o.created_at, o.updated_at
       FROM opportunities o
       LEFT JOIN companies c ON o.company_id = c.company_id
       WHERE o.status = 'active'
       ORDER BY o.created_at DESC`
    );
    return res.json(rows);
  } catch (err) {
    console.error('Get all opportunities error:', err);
    return res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
};

exports.applyToOpportunity = async (req, res) => {
  try {
    const { opportunity_id, resume_url } = req.body;
    const { user_id, role } = req.user;

    if (role !== 'student') return res.status(403).json({ error: 'Only students can apply' });

    // check if opportunity exists and is active
    const [oppCheck] = await pool.query(
      `SELECT o.*, u.email AS alumni_email, a.name AS alumni_name
       FROM opportunities o
       JOIN users u ON o.alumni_id = u.user_id
       JOIN alumni_profiles a ON a.user_id = o.alumni_id
       WHERE o.opportunity_id = ? AND o.status = 'active'`,
      [opportunity_id]
    );
    if (oppCheck.length === 0) return res.status(404).json({ error: 'Opportunity not found or closed' });
    const opportunity = oppCheck[0];

    // check if student already applied
    const [existing] = await pool.query(
      `SELECT * FROM applications WHERE opportunity_id = ? AND student_id = ?`,
      [opportunity_id, user_id]
    );
    if (existing.length > 0) return res.status(400).json({ error: 'Already applied' });

    // insert application
    await pool.query(
      `INSERT INTO applications (opportunity_id, student_id, resume_url, status) VALUES (?, ?, ?, 'pending')`,
      [opportunity_id, user_id, resume_url]
    );

    // fetch student details
    const [[student]] = await pool.query(
      `SELECT u.email, s.name FROM users u
       JOIN student_profiles s ON u.user_id = s.user_id
       WHERE u.user_id = ?`,
      [user_id]
    );

    // send confirmation email to student
    sendEmail(
      student.email,
      `Application Submitted: ${opportunity.title}`,
      `<p>Hi ${student.name},</p>
       <p>Your application for <b>${opportunity.title}</b> has been submitted successfully.</p>`
    );

    // send notification to alumni
    sendEmail(
      opportunity.alumni_email,
      `New Application for ${opportunity.title}`,
      `<p>Hi ${opportunity.alumni_name},</p>
       <p>A new student has applied to your opportunity <b>${opportunity.title}</b>.</p>`
    );

    return res.status(201).json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Apply to opportunity error:', err);
    return res.status(500).json({ error: 'Failed to apply' });
  }
};

/**
 * NEW: Get the current student's applications with related opportunity info
 * GET /api/applications/my-applications
 */
exports.getMyApplications = async (req, res) => {
  try {
    const { user_id, role } = req.user;
    if (role !== 'student') return res.status(403).json({ error: 'Only students can view their applications' });

    const [rows] = await pool.query(
      `SELECT a.application_id, a.opportunity_id, a.resume_url, a.status AS application_status, a.applied_at,
              o.title AS opportunity_title, o.type AS opportunity_type, o.status AS opportunity_status,
              c.name AS company_name, o.created_at AS opportunity_created_at
       FROM applications a
       JOIN opportunities o ON a.opportunity_id = o.opportunity_id
       LEFT JOIN companies c ON o.company_id = c.company_id
       WHERE a.student_id = ?
       ORDER BY a.applied_at DESC`,
      [user_id]
    );

    return res.json(rows);
  } catch (err) {
    console.error('Get my applications error:', err);
    return res.status(500).json({ error: 'Failed to fetch your applications' });
  }
};

