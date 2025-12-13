// src/controllers/opportunity.controller.js
const pool = require('../../config/db');
const sendEmail = require("../utils/email");

exports.createOpportunity = async (req, res) => {
  try {
    const { title, description, type, company_name } = req.body;  // 👈 alumni passes company_name
    const alumniId = req.user.user_id; // logged-in alumni

    // ✅ Fetch company_id using company_name
    const [companyRows] = await pool.query(
      "SELECT company_id FROM companies WHERE name = ?",
      [company_name]
    );

    if (companyRows.length === 0) {
      return res.status(400).json({ error: "Company not found" });
    }

    const companyId = companyRows[0].company_id;

    // ✅ Insert opportunity with company_id
    const [result] = await pool.query(
      "INSERT INTO opportunities (alumni_id, company_id, title, description, type) VALUES (?, ?, ?, ?, ?)",
      [alumniId, companyId, title, description, type]
    );

    // ✅ Fetch alumni details (email + name)
    const [alumniRows] = await pool.query(
      `SELECT u.email, a.name 
       FROM users u 
       JOIN alumni_profiles a ON u.user_id = a.user_id 
       WHERE u.user_id = ?`,
      [alumniId]
    );
    const alumni = alumniRows[0];

    // ✅ Send confirmation email to alumni
    await sendEmail(
      alumni.email,
      "Your Opportunity has been Posted",
      `<p>Hi ${alumni.name},</p>
       <p>Your opportunity <b>${title}</b> has been posted successfully for company <b>${company_name}</b>.</p>`
    );

    // ✅ Fetch all student emails + names
    const [students] = await pool.query(
      `SELECT u.email, s.name 
       FROM users u
       JOIN student_profiles s ON u.user_id = s.user_id
       WHERE u.role = 'student'`
    );

    // ✅ Send notification to all students
    for (const student of students) {
      await sendEmail(
        student.email,
        `New Opportunity: ${title} at ${company_name}`,
        `<p>Hi ${student.name},</p>
         <p>A new opportunity <b>${title}</b> has been posted by ${alumni.name}.</p>
         <p><b>Company:</b> ${company_name}</p>
         <p><b>Description:</b> ${description}</p>
         <p><b>Type:</b> ${type}</p>
         <p>Login to the Alumni Network to know more and apply.</p>`
      );
    }

    res.status(201).json({ message: "Opportunity created and emails sent successfully" });

  } catch (error) {
    console.error("Create opportunity error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
// Get my postings (alumni only). Uses LEFT JOIN to include company_name even if missing.
exports.getMyPostings = async (req, res) => {
  try {
    const { user_id, role } = req.user;
    if (role !== 'alumni') return res.status(403).json({ error: 'Only alumni can view postings' });

    const [rows] = await pool.query(
      `SELECT o.opportunity_id, o.alumni_id, o.company_id, c.name AS company_name,
              o.title, o.description, o.type, o.status, o.created_at, o.updated_at,
              (SELECT COUNT(*) FROM applications a WHERE a.opportunity_id = o.opportunity_id) AS application_count
       FROM opportunities o
       LEFT JOIN companies c ON o.company_id = c.company_id
       WHERE o.alumni_id = ?
       ORDER BY o.created_at DESC`,
      [user_id]
    );

    return res.json(rows);
  } catch (err) {
    console.error('Get my postings error:', err);
    return res.status(500).json({ error: 'Failed to fetch postings' });
  }
};

// Update opportunity (owner only)
exports.updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, type, status } = req.body;
    const { user_id, role } = req.user;
    if (role !== 'alumni') return res.status(403).json({ error: 'Only alumni can update postings' });

    const [check] = await pool.query('SELECT alumni_id FROM opportunities WHERE opportunity_id = ? LIMIT 1', [id]);
    if (check.length === 0) return res.status(404).json({ error: 'Opportunity not found' });
    if (check[0].alumni_id !== user_id) return res.status(403).json({ error: 'Not authorized' });

    await pool.query(
      `UPDATE opportunities SET title = ?, description = ?, type = ?, status = ? WHERE opportunity_id = ?`,
      [title, description, type, status, id]
    );

    return res.json({ message: 'Opportunity updated' });
  } catch (err) {
    console.error('Update opportunity error:', err);
    return res.status(500).json({ error: 'Failed to update opportunity' });
  }
};

