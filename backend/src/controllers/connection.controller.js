const pool = require('../../config/db'); // your pool

// normalize pair so that (a, b) is always stored as (low, high)
function normalizePair(a, b) {
  return (+a <= +b) ? [ +a, +b ] : [ +b, +a ];
}

// send connection request
exports.sendRequest = async (req, res) => {
  try {
    const { to_user_id } = req.body;
    const fromId = req.user.user_id;

    if (!to_user_id || isNaN(to_user_id)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const [low, high] = normalizePair(fromId, to_user_id);

    const [result] = await pool.query(
      "INSERT INTO connections (user_a, user_b, status, requested_by) VALUES (?, ?, 'pending', ?)",
      [low, high, fromId]
    );

    res.status(201).json({ message: "Connection request sent", connection_id: result.insertId });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Connection request already exists" });
    }
    console.error("❌ sendRequest error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// respond to a connection request
exports.respondRequest = async (req, res) => {
  try {
    const { connection_id, action } = req.body; // 'accept' or 'reject'
    const userId = req.user.user_id;

    const [rows] = await pool.query("SELECT * FROM connections WHERE connection_id = ?", [connection_id]);
    if (!rows.length) return res.status(404).json({ message: "Connection not found" });

    const connection = rows[0];
    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Already responded" });
    }

    if (connection.user_a !== userId && connection.user_b !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const newStatus = action === "accept" ? "accepted" : "rejected";
    await pool.query("UPDATE connections SET status = ? WHERE connection_id = ?", [newStatus, connection_id]);

    res.json({ message: `Request ${newStatus}` });
  } catch (err) {
    console.error("❌ respondRequest error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get all connections for logged-in user
exports.getConnections = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [rows] = await pool.query(
      `SELECT c.connection_id, c.status,
              u.user_id, u.email, u.role
       FROM connections c
       JOIN users u ON (u.user_id = IF(c.user_a = ?, c.user_b, c.user_a))
       WHERE (c.user_a = ? OR c.user_b = ?) AND c.status = 'accepted'`,
      [userId, userId, userId]
    );

    res.json(rows); // returns array
  } catch (err) {
    console.error("❌ getConnections error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get pending requests for logged-in user
exports.getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [rows] = await pool.query(
      `SELECT c.connection_id, c.requested_by, u.email
       FROM connections c
       JOIN users u ON c.requested_by = u.user_id
       WHERE (c.user_a = ? OR c.user_b = ?)
         AND c.status = 'pending'
         AND c.requested_by != ?`,
      [userId, userId, userId]
    );

    res.json(rows); // returns array
  } catch (err) {
    console.error("❌ getPendingRequests error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
