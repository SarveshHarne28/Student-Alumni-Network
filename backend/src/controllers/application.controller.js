// src/controllers/application.controller.js
const pool = require('../../config/db');
const sendEmail = require("../utils/email");

// Get applications for a specific opportunity (alumni only)
exports.getApplicationsForOpportunity = async (req, res) => {
  try {
    const { opportunity_id } = req.params;
    const { user_id, role } = req.user;

    if (role !== 'alumni') return res.status(403).json({ error: 'Only alumni can view applications' });

    // Verify the opportunity belongs to the alumni
    const [opCheck] = await pool.query(
      'SELECT alumni_id FROM opportunities WHERE opportunity_id = ? LIMIT 1',
      [opportunity_id]
    );

    if (opCheck.length === 0) return res.status(404).json({ error: 'Opportunity not found' });
    if (opCheck[0].alumni_id !== user_id) return res.status(403).json({ error: 'Not authorized' });

    // Fetch applications with student profile
    const [applications] = await pool.query(
      `SELECT a.application_id, a.resume_url, a.status, a.applied_at,
              s.user_id AS student_id, s.name, s.phone, s.graduation_year, s.major, s.cgpa,
              u.email
       FROM applications a
       JOIN student_profiles s ON a.student_id = s.user_id
       JOIN users u ON s.user_id = u.user_id
       WHERE a.opportunity_id = ?
       ORDER BY a.applied_at DESC`,
      [opportunity_id]
    );

    return res.json(applications);
  } catch (err) {
    console.error('Get applications error:', err);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { application_id } = req.params;
    const { status } = req.body;
    const { user_id, role } = req.user;

    if (role !== 'alumni') return res.status(403).json({ error: 'Only alumni can update applications' });
    if (!['pending', 'accepted', 'rejected'].includes(status))
      return res.status(400).json({ error: 'Invalid status' });

    // Check ownership via opportunity
    const [appCheck] = await pool.query(
      `SELECT a.student_id, o.alumni_id, o.title
       FROM applications a
       JOIN opportunities o ON a.opportunity_id = o.opportunity_id
       WHERE a.application_id = ?`,
      [application_id]
    );
    if (appCheck.length === 0) return res.status(404).json({ error: 'Application not found' });
    if (appCheck[0].alumni_id !== user_id) return res.status(403).json({ error: 'Not authorized' });

    await pool.query('UPDATE applications SET status = ? WHERE application_id = ?', [status, application_id]);

    // fetch student email
    const [[student]] = await pool.query(
      `SELECT u.email, s.name FROM users u
       JOIN student_profiles s ON u.user_id = s.user_id
       WHERE u.user_id = ?`,
      [appCheck[0].student_id]
    );

    // send email to student
    sendEmail(
      student.email,
      `Application ${status === 'accepted' ? 'Accepted' : 'Rejected'}: ${appCheck[0].title}`,
      `<p>Hi ${student.name},</p>
       <p>Your application for <b>${appCheck[0].title}</b> has been <b>${status}</b>.</p>`
    );

    return res.json({ message: 'Application status updated' });
  } catch (err) {
    console.error('Update application status error:', err);
    return res.status(500).json({ error: 'Failed to update application' });
  }
};

// ========== NEW FUNCTIONS ==========

// Get accepted students for an opportunity
exports.getAcceptedStudents = async (req, res) => {
  try {
    const { opportunity_id } = req.params;
    const { user_id, role } = req.user;

    console.log(`🔍 Fetching accepted students for opportunity: ${opportunity_id}, user: ${user_id}`);

    if (role !== 'alumni') {
      return res.status(403).json({ error: 'Only alumni can view accepted students' });
    }

    // Verify the opportunity belongs to the alumni
    const [opCheck] = await pool.query(
      'SELECT alumni_id, title FROM opportunities WHERE opportunity_id = ? LIMIT 1',
      [opportunity_id]
    );

    if (opCheck.length === 0) {
      console.log('❌ Opportunity not found:', opportunity_id);
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    
    if (opCheck[0].alumni_id !== user_id) {
      console.log('❌ Unauthorized access attempt:', user_id, 'for opportunity:', opportunity_id);
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Fetch accepted applications with student profiles
    const [applications] = await pool.query(
      `SELECT a.application_id, a.student_id, a.applied_at, a.resume_url,
              s.name, s.phone, s.graduation_year, s.major, s.cgpa,
              u.email
       FROM applications a
       JOIN student_profiles s ON a.student_id = s.user_id
       JOIN users u ON s.user_id = u.user_id
       WHERE a.opportunity_id = ? AND a.status = 'accepted'
       ORDER BY a.applied_at DESC`,
      [opportunity_id]
    );

    console.log(`✅ Found ${applications.length} accepted students for opportunity ${opportunity_id}`);

    return res.json({
      opportunity_title: opCheck[0].title,
      students: applications
    });
  } catch (err) {
    console.error('❌ Get accepted students error:', err);
    return res.status(500).json({ error: 'Failed to fetch accepted students' });
  }
};

// Send email to accepted students
exports.notifyAcceptedStudents = async (req, res) => {
  try {
    const { opportunity_id } = req.params;
    const { email_content, student_ids } = req.body;
    const { user_id, role } = req.user;

    console.log(`📧 Sending email to accepted students for opportunity: ${opportunity_id}`);

    if (role !== 'alumni') {
      return res.status(403).json({ error: 'Only alumni can send notifications' });
    }

    // Verify opportunity ownership
    const [opportunity] = await pool.query(
      `SELECT o.opportunity_id, o.title, o.alumni_id, a.name as alumni_name
       FROM opportunities o
       JOIN alumni_profiles a ON o.alumni_id = a.user_id
       WHERE o.opportunity_id = ?`,
      [opportunity_id]
    );

    if (opportunity.length === 0) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    
    if (opportunity[0].alumni_id !== user_id) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Get student emails
    const [students] = await pool.query(
      `SELECT u.email, s.name 
       FROM users u 
       JOIN student_profiles s ON u.user_id = s.user_id 
       WHERE u.user_id IN (?)`,
      [student_ids]
    );

    if (students.length === 0) {
      return res.status(400).json({ error: 'No valid students found' });
    }

    console.log(`📨 Sending email to ${students.length} students`);

    // Send email to each student
    const emailPromises = students.map(student => 
      sendEmail(
        student.email,
        `Next Steps for ${opportunity[0].title}`,
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(to right, #0a66c2, #004182); padding: 20px; color: white; text-align: center;">
            <h1>Congratulations! 🎉</h1>
            <h2>${opportunity[0].title}</h2>
          </div>
          <div style="padding: 20px;">
            <p>Dear <strong>${student.name}</strong>,</p>
            <p>Congratulations on being accepted for <strong>${opportunity[0].title}</strong>!</p>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0a66c2;">
              ${email_content.replace(/\n/g, '<br>')}
            </div>
            
            <p>If you have any questions, please don't hesitate to reach out.</p>
            <p>Best regards,<br>
            <strong>${opportunity[0].alumni_name}</strong></p>
          </div>
          <div style="background: #f3f2ef; padding: 15px; text-align: center; color: #666; font-size: 12px;">
            <p>This email was sent via JNEC Alumni Network</p>
          </div>
        </div>`
      )
    );

    await Promise.all(emailPromises);

    return res.json({ 
      message: `Notification sent to ${students.length} students successfully`,
      students_count: students.length
    });
  } catch (err) {
    console.error('❌ Notify accepted students error:', err);
    return res.status(500).json({ error: 'Failed to send notifications' });
  }
};