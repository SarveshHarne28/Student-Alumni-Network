import React, { useEffect, useState } from "react";
import axios from "axios";

/**
 * AdminPanel - simple list of pending alumni and verify/revoke actions.
 * Styled in a clean LinkedIn-style look using inline CSS only.
 */
export default function AdminPanel({ token }) {
  const [pending, setPending] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const t = token || localStorage.getItem("token");

  const fetchPending = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/admin/pending-users", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setPending(res.data || []);
    } catch (err) {
      console.error("Fetch pending users error:", err);
      setError(err.response?.data?.error || "Failed to fetch pending users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (t) fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  const verify = async (userId) => {
    setActionLoading(userId);
    try {
      await axios.post(`http://localhost:3000/api/admin/verify/${userId}`, {}, {
        headers: { Authorization: `Bearer ${t}` },
      });
      fetchPending();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to verify");
    } finally {
      setActionLoading(null);
    }
  };

  const revoke = async (userId) => {
    setActionLoading(userId);
    try {
      await axios.post(`http://localhost:3000/api/admin/revoke/${userId}`, {}, {
        headers: { Authorization: `Bearer ${t}` },
      });
      fetchPending();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to revoke");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Admin Panel</h3>
        <div style={styles.subtitle}>Manage pending alumni verification requests</div>
      </div>

      {error && (
        <div style={styles.errorMessage}>
          <span style={styles.messageIcon}>❌</span>
          {error}
        </div>
      )}

      <div style={styles.stats}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{pending.length}</div>
          <div style={styles.statLabel}>Pending Requests</div>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <div>Loading pending requests...</div>
        </div>
      ) : pending.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <h4 style={styles.emptyTitle}>No Pending Requests</h4>
          <p style={styles.emptyText}>All alumni accounts are currently verified.</p>
        </div>
      ) : (
        <div style={styles.listContainer}>
          <div style={styles.listHeader}>
            <span>Pending Alumni Accounts</span>
            <span style={styles.countBadge}>{pending.length}</span>
          </div>
          
          <div style={styles.userList}>
            {pending.map((user) => (
              <div key={user.user_id} style={styles.userCard}>
                <div style={styles.userAvatar}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                
                <div style={styles.userInfo}>
                  <h4 style={styles.userName}>{user.name || "Unnamed User"}</h4>
                  <p style={styles.userEmail}>{user.email}</p>
                  {user.company_name && (
                    <p style={styles.userCompany}>
                      <span style={styles.companyIcon}>🏢</span>
                      {user.company_name}
                    </p>
                  )}
                  {user.position && (
                    <p style={styles.userPosition}>
                      <span style={styles.positionIcon}>💼</span>
                      {user.position}
                    </p>
                  )}
                  <div style={styles.userMeta}>
                    <span style={styles.metaItem}>ID: {user.user_id}</span>
                    <span style={styles.metaItem}>Role: {user.role}</span>
                  </div>
                </div>

                <div style={styles.actionButtons}>
                  <button
                    onClick={() => verify(user.user_id)}
                    disabled={actionLoading === user.user_id}
                    style={{
                      ...styles.verifyButton,
                      ...(actionLoading === user.user_id ? styles.buttonDisabled : {})
                    }}
                  >
                    {actionLoading === user.user_id ? (
                      <>
                        <span style={styles.buttonSpinner}></span>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <span style={styles.buttonIcon}>✓</span>
                        Verify
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => revoke(user.user_id)}
                    disabled={actionLoading === user.user_id}
                    style={{
                      ...styles.revokeButton,
                      ...(actionLoading === user.user_id ? styles.buttonDisabled : {})
                    }}
                  >
                    {actionLoading === user.user_id ? (
                      <>
                        <span style={styles.buttonSpinner}></span>
                        Revoking...
                      </>
                    ) : (
                      <>
                        <span style={styles.buttonIcon}>✕</span>
                        Revoke
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.footer}>
        <button
          onClick={fetchPending}
          disabled={loading}
          style={{
            ...styles.refreshButton,
            ...(loading ? styles.buttonDisabled : {})
          }}
        >
          {loading ? (
            <>
              <span style={styles.buttonSpinner}></span>
              Refreshing...
            </>
          ) : (
            <>
              <span style={styles.buttonIcon}>🔄</span>
              Refresh List
            </>
          )}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    maxWidth: "900px", 
    margin: "20px auto", 
    padding: "30px", 
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", 
    borderRadius: "16px", 
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    minHeight: "600px"
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #f1f5f9"
  },
  title: { 
    margin: "0 0 8px 0", 
    color: "#1e293b", 
    fontSize: "32px",
    fontWeight: "700",
    background: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  subtitle: {
    color: "#64748b",
    fontSize: "16px",
    fontWeight: "400"
  },
  stats: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px"
  },
  statCard: {
    background: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
    color: "white",
    padding: "20px 30px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.3)"
  },
  statNumber: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "4px"
  },
  statLabel: {
    fontSize: "14px",
    opacity: "0.9",
    fontWeight: "500"
  },
  listContainer: {
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflow: "hidden"
  },
  listHeader: {
    padding: "20px 24px",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: "600",
    color: "#1e293b",
    fontSize: "16px"
  },
  countBadge: {
    background: "#0ea5e9",
    color: "white",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600"
  },
  userList: {
    maxHeight: "500px",
    overflowY: "auto"
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #f1f5f9",
    transition: "all 0.2s ease",
    background: "#ffffff"
  },
  userAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "18px",
    marginRight: "16px",
    flexShrink: 0
  },
  userInfo: {
    flex: 1
  },
  userName: {
    margin: "0 0 4px 0",
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b"
  },
  userEmail: {
    margin: "0 0 8px 0",
    color: "#64748b",
    fontSize: "14px"
  },
  userCompany: {
    margin: "4px 0",
    color: "#475569",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  userPosition: {
    margin: "4px 0",
    color: "#475569",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  },
  companyIcon: {
    fontSize: "12px"
  },
  positionIcon: {
    fontSize: "12px"
  },
  userMeta: {
    display: "flex",
    gap: "12px",
    marginTop: "8px"
  },
  metaItem: {
    color: "#94a3b8",
    fontSize: "12px",
    background: "#f1f5f9",
    padding: "2px 8px",
    borderRadius: "4px"
  },
  actionButtons: {
    display: "flex",
    gap: "10px",
    flexShrink: 0
  },
  verifyButton: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s ease"
  },
  revokeButton: {
    padding: "10px 20px",
    background: "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "all 0.2s ease"
  },
  buttonDisabled: {
    opacity: "0.6",
    cursor: "not-allowed",
    transform: "none"
  },
  buttonIcon: {
    fontSize: "14px",
    fontWeight: "bold"
  },
  buttonSpinner: {
    width: "14px",
    height: "14px",
    border: "2px solid transparent",
    borderTop: "2px solid currentColor",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  },
  footer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #e2e8f0"
  },
  refreshButton: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
    color: "#475569",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease"
  },
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    color: "#64748b",
    fontSize: "16px",
    gap: "16px"
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    color: "#64748b",
    textAlign: "center"
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    opacity: "0.5"
  },
  emptyTitle: {
    margin: "0 0 8px 0",
    color: "#475569",
    fontSize: "18px",
    fontWeight: "600"
  },
  emptyText: {
    margin: "0",
    color: "#94a3b8",
    fontSize: "14px"
  },
  errorMessage: { 
    padding: "16px",
    background: "linear-gradient(135deg, #fef2f2, #fecaca)",
    color: "#dc2626",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "500",
    border: "1px solid #fecaca",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "20px"
  },
  messageIcon: {
    fontSize: "16px"
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #f1f5f9",
    borderTop: "3px solid #0ea5e9",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
  }
};

// Add CSS animation for spinner
const spinnerStyle = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject the spinner animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = spinnerStyle;
  document.head.appendChild(styleSheet);
}