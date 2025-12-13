import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyApplications({ token }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const t = token || localStorage.getItem("token");

  const fetchMyApplications = async () => {
    setError("");
    setLoading(true);
    if (!t) {
      setError("Please login to view your applications");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/api/applications/my-applications", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setApplications(res.data || []);
    } catch (err) {
      console.error("Fetch my applications error:", err);
      setError(err.response?.data?.error || "Failed to load your applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, [token]);

  // Filter applications by status
  const filteredApplications = filterStatus === "all" 
    ? applications 
    : applications.filter(a => a.application_status.toLowerCase() === filterStatus);

  // Get status counts
  const statusCounts = {
    total: applications.length,
    pending: applications.filter(a => a.application_status.toLowerCase() === "pending").length,
    accepted: applications.filter(a => a.application_status.toLowerCase() === "accepted").length,
    rejected: applications.filter(a => a.application_status.toLowerCase() === "rejected").length,
  };

  // Get icon based on opportunity type
  const getTypeIcon = (type) => {
    const icons = {
      'Job': '💼',
      'Internship': '🎓',
      'Project': '🚀',
      'Mentorship': '👨‍🏫',
      'Event': '📅',
      'Workshop': '🛠️'
    };
    return icons[type] || '💡';
  };

  if (loading) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.loadingContainer}>
          <div style={styles.loader}></div>
          <p style={styles.loadingText}>Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <p style={styles.errorText}>{error}</p>
          <button onClick={fetchMyApplications} style={styles.retryButton}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>My Applications</h1>
          <p style={styles.heroDescription}>
            Track and manage all your job and internship applications in one place
          </p>
          
          {/* Stats Bar */}
          <div style={styles.statsBar}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{statusCounts.total}</span>
              <span style={styles.statLabel}>Total</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{statusCounts.pending}</span>
              <span style={styles.statLabel}>Pending</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{statusCounts.accepted}</span>
              <span style={styles.statLabel}>Accepted</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{statusCounts.rejected}</span>
              <span style={styles.statLabel}>Rejected</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section style={styles.mainSection}>
        <div style={styles.container}>
          {/* Filter Tabs */}
          <div style={styles.filterContainer}>
            <button
              onClick={() => setFilterStatus("all")}
              style={filterStatus === "all" ? styles.filterButtonActive : styles.filterButton}
            >
              All Applications ({statusCounts.total})
            </button>
            <button
              onClick={() => setFilterStatus("pending")}
              style={filterStatus === "pending" ? styles.filterButtonActive : styles.filterButton}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setFilterStatus("accepted")}
              style={filterStatus === "accepted" ? styles.filterButtonActive : styles.filterButton}
            >
              Accepted ({statusCounts.accepted})
            </button>
            <button
              onClick={() => setFilterStatus("rejected")}
              style={filterStatus === "rejected" ? styles.filterButtonActive : styles.filterButton}
            >
              Rejected ({statusCounts.rejected})
            </button>
            
            <button 
              onClick={fetchMyApplications} 
              style={styles.refreshButton}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#004182"}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#0a66c2"}
            >
              🔄 Refresh
            </button>
          </div>

          {/* Applications List */}
          {filteredApplications.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                {filterStatus === "all" ? "📭" : "🔍"}
              </div>
              <h3 style={styles.emptyTitle}>
                {filterStatus === "all" 
                  ? "No Applications Yet" 
                  : `No ${filterStatus} Applications`}
              </h3>
              <p style={styles.emptyText}>
                {filterStatus === "all"
                  ? "Start exploring opportunities and apply to positions that interest you"
                  : `You don't have any ${filterStatus} applications at the moment`}
              </p>
            </div>
          ) : (
            <div style={styles.applicationsGrid}>
              {filteredApplications.map((a) => (
                <div
                  key={a.application_id}
                  style={styles.applicationCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)";
                    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
                    e.currentTarget.style.borderColor = "#0a66c2";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                    e.currentTarget.style.borderColor = "#e0e0e0";
                  }}
                >
                  {/* Card Header */}
                  <div style={styles.cardHeader}>
                    <div style={styles.headerLeft}>
                      <div style={styles.typeIcon}>
                        {getTypeIcon(a.opportunity_type)}
                      </div>
                      <div>
                        <h3 style={styles.opportunityTitle}>
                          {a.opportunity_title}
                        </h3>
                        <div style={styles.companyInfo}>
                          <span style={styles.companyName}>
                            {a.company_name || "Not Specified"}
                          </span>
                          <span style={styles.separator}>•</span>
                          <span style={styles.opportunityType}>
                            {a.opportunity_type}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={styles.statusBadge(a.application_status)}>
                      {a.application_status.charAt(0).toUpperCase() + a.application_status.slice(1)}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={styles.cardBody}>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>📅 Applied:</span>
                      <span style={styles.infoValue}>
                        {new Date(a.applied_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>📝 Posted:</span>
                      <span style={styles.infoValue}>
                        {new Date(a.opportunity_created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>📄 Resume:</span>
                      {a.resume_url ? (
                        <a 
                          href={a.resume_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          style={styles.resumeLink}
                          onMouseOver={(e) => e.currentTarget.style.textDecoration = "underline"}
                          onMouseOut={(e) => e.currentTarget.style.textDecoration = "none"}
                        >
                          View Resume →
                        </a>
                      ) : (
                        <span style={styles.noResume}>No resume provided</span>
                      )}
                    </div>
                  </div>

                  
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      
    </div>
  );
}

const styles = {
  pageWrapper: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Segoe UI', system-ui, Arial, sans-serif",
  },

  // Loading State
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    padding: "40px",
  },
  loader: {
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #0a66c2",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    fontSize: "18px",
    color: "#666",
  },

  // Error State
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    padding: "40px",
  },
  errorIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },
  errorText: {
    fontSize: "18px",
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: "20px",
  },
  retryButton: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    padding: "12px 28px",
    borderRadius: "25px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  // Hero Section
  heroSection: {
    background: "linear-gradient(135deg, #0a66c2 0%, #004182 100%)",
    color: "white",
    padding: "80px 20px 60px",
    textAlign: "center",
  },
  heroContent: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: "700",
    marginBottom: "16px",
    lineHeight: "1.2",
  },
  heroDescription: {
    fontSize: "18px",
    marginBottom: "40px",
    opacity: 0.95,
    lineHeight: "1.6",
  },
  statsBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "20px 40px",
    borderRadius: "50px",
    maxWidth: "700px",
    margin: "0 auto",
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "4px",
  },
  statLabel: {
  fontSize: "14px",
  opacity: 0.9,
  },
  statDivider: {
    width: "1px",
    height: "40px",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },

  // Main Section
  mainSection: {
    padding: "60px 20px 80px",
    minHeight: "60vh",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },

  // Filter Container
  filterContainer: {
    display: "flex",
    gap: "12px",
    marginBottom: "40px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  filterButton: {
    backgroundColor: "white",
    color: "#666",
    border: "2px solid #e0e0e0",
    padding: "12px 24px",
    borderRadius: "25px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  filterButtonActive: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "2px solid #0a66c2",
    padding: "12px 24px",
    borderRadius: "25px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  refreshButton: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "25px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginLeft: "auto",
  },

  // Empty State
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
  },
  emptyIcon: {
    fontSize: "80px",
    marginBottom: "20px",
  },
  emptyTitle: {
    fontSize: "28px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "12px",
  },
  emptyText: {
    fontSize: "16px",
    color: "#666",
    maxWidth: "500px",
    margin: "0 auto",
  },

  // Applications Grid
  applicationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
    gap: "30px",
  },

  // Application Card
  applicationCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "28px",
    border: "2px solid #e0e0e0",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "2px solid #f0f0f0",
  },
  headerLeft: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
    flex: 1,
  },
  typeIcon: {
    fontSize: "32px",
    marginTop: "4px",
  },
  opportunityTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0a66c2",
    marginBottom: "8px",
    lineHeight: "1.3",
  },
  companyInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#666",
  },
  companyName: {
    fontWeight: "600",
    color: "#333",
  },
  separator: {
    color: "#ccc",
  },
  opportunityType: {
    color: "#666",
  },
  statusBadge: (status) => {
    const statusLower = status.toLowerCase();
    const colors = {
      pending: { bg: "#fff3cd", color: "#856404", border: "#ffc107" },
      accepted: { bg: "#d1f7d6", color: "#0a8f33", border: "#28a745" },
      rejected: { bg: "#fcdada", color: "#c62828", border: "#dc3545" },
    };
    const color = colors[statusLower] || { bg: "#f0f0f0", color: "#555", border: "#ccc" };
    
    return {
      display: "inline-block",
      padding: "8px 16px",
      borderRadius: "20px",
      fontWeight: "700",
      fontSize: "13px",
      textTransform: "capitalize",
      backgroundColor: color.bg,
      color: color.color,
      border: `2px solid ${color.border}`,
      whiteSpace: "nowrap",
    };
  },

  // Card Body
  cardBody: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginBottom: "20px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "15px",
  },
  infoLabel: {
    color: "#666",
    fontWeight: "600",
  },
  infoValue: {
    color: "#333",
    fontWeight: "500",
  },
  resumeLink: {
    color: "#0a66c2",
    fontWeight: "600",
    textDecoration: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  noResume: {
    color: "#999",
    fontStyle: "italic",
  },

  // Card Footer
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "16px",
    borderTop: "1px solid #f0f0f0",
  },
  applicationId: {
    fontSize: "13px",
    color: "#999",
    fontWeight: "600",
  },
  footerActions: {
    display: "flex",
    gap: "8px",
  },
  viewButton: {
    backgroundColor: "transparent",
    color: "#0a66c2",
    border: "2px solid #0a66c2",
    padding: "8px 18px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // Footer
  footer: {
    backgroundColor: "#1a1a1a",
    color: "white",
    padding: "60px 20px 20px",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "40px",
    marginBottom: "40px",
  },
  footerSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  footerTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0a66c2",
    marginBottom: "8px",
  },
  footerSubtitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  footerText: {
    fontSize: "14px",
    color: "#ccc",
    lineHeight: "1.6",
    margin: "4px 0",
  },
  footerLink: {
    fontSize: "14px",
    color: "#ccc",
    textDecoration: "none",
    transition: "color 0.3s ease",
  },
  footerBottom: {
    maxWidth: "1200px",
    margin: "0 auto",
    paddingTop: "20px",
    borderTop: "1px solid #333",
    textAlign: "center",
  },
  footerCopyright: {
    fontSize: "14px",
    color: "#999",
  },
};

// Add keyframe animation for loader
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);