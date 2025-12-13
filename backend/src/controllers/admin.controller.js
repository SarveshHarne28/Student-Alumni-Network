// src/controllers/admin.controller.js
const pool = require('../../config/db');
const { sendEmail, sendWelcomeEmail } = require("../utils/email"); // ✅ Fixed import

// GET /api/admin/pending-users  (admin only)
exports.getPendingUsers = async (req, res) => {
  try {
    // pending alumni (verified = 0)
    const [rows] = await pool.query(
      `SELECT u.user_id, u.email, u.role, a.name, a.company_id, c.name AS company_name, a.position, a.graduation_year
       FROM users u
       JOIN alumni_profiles a ON a.user_id = u.user_id
       LEFT JOIN companies c ON a.company_id = c.company_id
       WHERE u.role = 'alumni' AND u.verified = 0
       ORDER BY u.created_at ASC`
    );

    return res.json(rows);
  } catch (err) {
    console.error('Get pending users error:', err);
    return res.status(500).json({ error: 'Failed to fetch pending users' });
  }
};

// POST /api/admin/verify/:userId  (admin only)
exports.verifyUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // First get user details before updating
    const [userRows] = await pool.query(
      `SELECT u.user_id, u.email, u.role, a.name 
       FROM users u 
       LEFT JOIN alumni_profiles a ON u.user_id = a.user_id 
       WHERE u.user_id = ? AND u.role = "alumni"`,
      [userId]
    );
    
    if (userRows.length === 0) return res.status(404).json({ error: 'User not found or not alumni' });
    
    const user = userRows[0];
    
    // Update verification status
    const [r] = await pool.query('UPDATE users SET verified = 1 WHERE user_id = ? AND role = "alumni"', [userId]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'User not found or not alumni' });
    
    // ✅ Send verification success email to alumni
    try {
      await sendEmail(
        user.email,
        "🎉 Your Student Alumni Account is Now Verified!",
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #0a66c2; margin: 0;">Congratulations, ${user.name}! 🎓</h2>
          </div>
          
          <p>Great news! Your Student Alumni account has been <strong style="color: #059669;">verified and approved</strong> by our admin team.</p>
          
          <div style="background: #d1fae5; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #a7f3d0;">
            <h4 style="color: #065f46; margin-top: 0;">🚀 You now have full access to:</h4>
            <ul style="margin-bottom: 0; color: #065f46;">
              <li>Post job and internship opportunities for students</li>
              <li>Connect with current JNEC students</li>
              <li>Network with fellow alumni</li>
              <li>Review applications and help students grow</li>
              <li>Share your industry experience and insights</li>
            </ul>
          </div>

          <p>Login to your account and start making an impact on the next generation of JNEC engineers!</p>

          <div style="text-align: center; margin: 25px 0;">
            <a href="http://localhost:5173/alumni-login" 
               style="background-color: #0a66c2; color: white; padding: 12px 30px; 
                      text-decoration: none; border-radius: 24px; font-weight: bold;
                      display: inline-block;">
              Login to Your Account
            </a>
          </div>

          <p>Thank you for being part of our growing alumni community and for supporting JNEC students!</p>

          <p>Best regards,<br>
          <strong>Student Alumni Network Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e1e4e8; margin: 25px 0;">
          
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p>Jawaharlal Nehru Engineering College<br>
            MGM University, Aurangabad</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>`
      );
      console.log(`✅ Verification success email sent to alumni: ${user.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send verification success email:', emailError);
      // Don't fail the verification if email fails
    }

    return res.json({ message: 'User verified' });
  } catch (err) {
    console.error('Verify user error:', err);
    return res.status(500).json({ error: 'Failed to verify user' });
  }
};

// POST /api/admin/revoke/:userId (admin only)
exports.revokeUser = async (req, res) => {
  const { userId } = req.params;
  try {
    // Get user details before revoking
    const [userRows] = await pool.query(
      `SELECT u.user_id, u.email, u.role, a.name 
       FROM users u 
       LEFT JOIN alumni_profiles a ON u.user_id = a.user_id 
       WHERE u.user_id = ? AND u.role = "alumni"`,
      [userId]
    );
    
    if (userRows.length === 0) return res.status(404).json({ error: 'User not found or not alumni' });
    
    const user = userRows[0];
    
    const [r] = await pool.query('UPDATE users SET verified = 0 WHERE user_id = ? AND role = "alumni"', [userId]);
    if (r.affectedRows === 0) return res.status(404).json({ error: 'User not found or not alumni' });
    
    // ✅ Send revocation notification email to alumni
    try {
      await sendEmail(
        user.email,
        "ℹ️ Your Student Alumni Account Access Update",
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e4e8; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #0a66c2; margin: 0;">Account Access Update</h2>
          </div>
          
          <p>Dear <strong>${user.name}</strong>,</p>
          
          <p>Your Student Alumni account verification has been <strong style="color: #dc2626;">temporarily revoked</strong>.</p>
          
          <div style="background: #fef2f2; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #fecaca;">
            <p style="color: #dc2626; margin: 0;">
              <strong>Note:</strong> You can still login to your account, but some alumni features may be limited until your account is re-verified.
            </p>
          </div>

          <p>If you believe this was done in error, or if you have any questions about this change, please contact our admin team.</p>

          <p>Best regards,<br>
          <strong>Student Alumni Network Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e1e4e8; margin: 25px 0;">
          
          <div style="text-align: center; color: #666; font-size: 12px;">
            <p>Jawaharlal Nehru Engineering College<br>
            MGM University, Aurangabad</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>`
      );
      console.log(`✅ Revocation notification email sent to alumni: ${user.email}`);
    } catch (emailError) {
      console.error('❌ Failed to send revocation email:', emailError);
      // Don't fail the revocation if email fails
    }

    return res.json({ message: 'User revoked' });
  } catch (err) {
    console.error('Revoke user error:', err);
    return res.status(500).json({ error: 'Failed to revoke user' });
  }
};