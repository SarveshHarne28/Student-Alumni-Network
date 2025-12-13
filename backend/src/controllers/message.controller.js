// src/controllers/message.controller.js
const pool = require('../../config/db');

// send a message (only if connection is accepted)
exports.sendMessage = async (req, res) => {
  try {
    const { to_user_id, message_text } = req.body;
    const fromId = req.user.user_id;

    // check connection
    const [rows] = await pool.query(
      `SELECT * FROM connections 
       WHERE ((user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?)) 
         AND status = 'accepted'`,
      [fromId, to_user_id, to_user_id, fromId]
    );

    if (!rows.length) return res.status(403).json({ message: "Not connected" });

    const [result] = await pool.query(
      "INSERT INTO messages (sender_id, receiver_id, message_text, read_status) VALUES (?, ?, ?, FALSE)",
      [fromId, to_user_id, message_text]
    );

    res.status(201).json({ 
      message: "Message sent", 
      message_id: result.insertId,
      read_status: false 
    });
  } catch (err) {
    console.error("❌ sendMessage error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get messages between two users
exports.getMessages = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { with_user_id } = req.params;

    const [rows] = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = ? AND receiver_id = ?) 
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY created_at ASC`,
      [userId, with_user_id, with_user_id, userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ getMessages error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { message_ids } = req.body;

    console.log("🔵 Mark as read called:", { userId, message_ids });

    if (!message_ids || !Array.isArray(message_ids)) {
      return res.status(400).json({ error: "Invalid message IDs" });
    }

    if (message_ids.length === 0) {
      return res.json({ message: "No messages to mark as read" });
    }

    // Convert array to comma-separated string for SQL
    const placeholders = message_ids.map(() => '?').join(',');
    const queryParams = [...message_ids, userId];

    const [result] = await pool.query(
      `UPDATE messages 
       SET read_status = TRUE, read_at = NOW() 
       WHERE message_id IN (${placeholders}) AND receiver_id = ? AND read_status = FALSE`,
      queryParams
    );

    console.log("✅ Messages marked as read:", result.affectedRows);

    res.json({ 
      message: "Messages marked as read", 
      updated_count: result.affectedRows 
    });
  } catch (err) {
    console.error("❌ markAsRead error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [rows] = await pool.query(
      `SELECT sender_id, COUNT(*) as unread_count 
       FROM messages 
       WHERE receiver_id = ? AND read_status = FALSE 
       GROUP BY sender_id`,
      [userId]
    );

    const unreadCounts = {};
    rows.forEach(row => {
      unreadCounts[row.sender_id] = row.unread_count;
    });

    res.json(unreadCounts);
  } catch (err) {
    console.error("❌ getUnreadCount error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};