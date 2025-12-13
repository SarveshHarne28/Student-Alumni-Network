import React, { useEffect, useState } from "react";
import ApplyOpportunity from "./ApplyOpportunity";

const OpportunitiesList = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Login required to view opportunities");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/api/applications/opportunities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setOpportunities(data);
        else setError(data.error || "Failed to fetch opportunities");
      } catch (err) {
        console.error("Fetch opportunities error:", err);
        setError("Failed to fetch opportunities");
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

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
          <p style={styles.loadingText}>Loading opportunities...</p>
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
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageWrapper}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Explore Opportunities</h1>
          <p style={styles.heroDescription}>
            Discover internships, jobs, and projects posted by JNEC alumni and industry partners
          </p>
          <div style={styles.statsBar}>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>{opportunities.length}</span>
              <span style={styles.statLabel}>Available</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>
                {opportunities.filter(o => o.type === 'Job').length}
              </span>
              <span style={styles.statLabel}>Jobs</span>
            </div>
            <div style={styles.statDivider}></div>
            <div style={styles.statItem}>
              <span style={styles.statNumber}>
                {opportunities.filter(o => o.type === 'Internship').length}
              </span>
              <span style={styles.statLabel}>Internships</span>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities List Section */}
      <section style={styles.mainSection}>
        <div style={styles.container}>
          {opportunities.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>
              <h3 style={styles.emptyTitle}>No Opportunities Available</h3>
              <p style={styles.emptyText}>
                Check back later for new opportunities from alumni and partners
              </p>
            </div>
          ) : (
            <div style={styles.opportunitiesGrid}>
              {opportunities.map((o) => (
                <div
                  key={o.opportunity_id}
                  style={styles.opportunityCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
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
                    <div style={styles.typeIcon}>{getTypeIcon(o.type)}</div>
                    <span style={styles.typeBadge}>{o.type}</span>
                  </div>

                  {/* Card Content */}
                  <h3 style={styles.opportunityTitle}>{o.title}</h3>
                  
                  <div style={styles.companyInfo}>
                    <span style={styles.companyName}>
                      {o.company_name || "Not Specified"}
                    </span>
                    {o.location && (
                      <span style={styles.location}>📍 {o.location}</span>
                    )}
                  </div>

                  <p style={styles.description}>
                    {o.description && o.description.length > 150
                      ? `${o.description.substring(0, 150)}...`
                      : o.description || "No description available"}
                  </p>

                  {/* Card Footer */}
                  <div style={styles.cardFooter}>
                    {o.posted_date && (
                      <span style={styles.postedDate}>
                        Posted {new Date(o.posted_date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    )}
                    
                    <button
                      onClick={() => setSelectedOpportunity(o)}
                      style={styles.applyButton}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#004182";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "#0a66c2";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      Apply Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Application Modal */}
      {selectedOpportunity && (
        <div style={styles.modalOverlay} onClick={() => setSelectedOpportunity(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <ApplyOpportunity 
              opportunity={selectedOpportunity} 
              onClose={() => setSelectedOpportunity(null)} 
            />
          </div>
        </div>
      )}

      {/* Footer */}
      
    </div>
  );
};

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
    maxWidth: "600px",
    margin: "0 auto",
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

  // Opportunities Grid
  opportunitiesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "30px",
  },

  // Opportunity Card
  opportunityCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "28px",
    border: "2px solid #e0e0e0",
    transition: "all 0.3s ease",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    minHeight: "280px",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  typeIcon: {
    fontSize: "32px",
  },
  typeBadge: {
    backgroundColor: "#e8f4fd",
    color: "#0a66c2",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  opportunityTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0a66c2",
    marginBottom: "12px",
    lineHeight: "1.3",
    minHeight: "56px",
  },
  companyInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "16px",
  },
  companyName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
  },
  location: {
    fontSize: "14px",
    color: "#666",
  },
  description: {
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "20px",
    flex: 1,
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "16px",
    borderTop: "1px solid #f0f0f0",
  },
  postedDate: {
    fontSize: "13px",
    color: "#888",
    fontWeight: "500",
  },
  applyButton: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    padding: "10px 24px",
    borderRadius: "25px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  // Modal
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: "16px",
    maxWidth: "600px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  },

  // Footer (same as Index)
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

export default OpportunitiesList;