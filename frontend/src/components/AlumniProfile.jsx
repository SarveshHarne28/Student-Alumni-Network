import React, { useEffect, useState } from "react";
import axios from "axios";
import EditAlumniProfile from "./EditAlumniProfile";

const AlumniProfile = ({ token }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const authToken = token || localStorage.getItem("token");
    
    if (!authToken) {
      setError("Token missing. Please login to view your alumni profile");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => {
        console.log("Alumni profile response:", res.data);
        setProfile(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Alumni profile fetch error:", err);
        setError(err.response?.data?.error || "Failed to fetch alumni profile");
        setLoading(false);
      });
  }, [token]);

  const handleSave = () => {
    setEditing(false);
    const authToken = token || localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/auth/profile", {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => {
        setProfile(res.data);
      });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading your professional profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <h3 style={styles.errorTitle}>Unable to Load Profile</h3>
        <p style={styles.errorText}>{error}</p>
        <button 
          style={styles.primaryButton}
          onClick={() => window.location.href = '/alumni-login'}
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>📭</div>
        <h3 style={styles.errorTitle}>No Profile Data</h3>
        <p style={styles.errorText}>No alumni profile data available</p>
      </div>
    );
  }

  if (editing) {
    return (
      <EditAlumniProfile
        token={token}
        profile={profile}
        onSave={handleSave}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <div style={styles.pageWrapper}>
      {/* Hero Banner */}
      <div style={styles.heroBanner}>
        <div style={styles.heroContent}>
          <div style={styles.profileImageSection}>
            <div style={styles.profileImage}>
              {profile.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
          <div style={styles.heroInfo}>
            <h1 style={styles.heroName}>{profile.name}</h1>
            <p style={styles.heroPosition}>
              {profile.position || "Alumni"} {profile.company_name && `at ${profile.company_name}`}
            </p>
            <p style={styles.heroMeta}>
              🎓 Class of {profile.graduation_year || "N/A"} • 📧 {profile.email}
            </p>
          </div>
          <button 
            onClick={() => setEditing(true)}
            style={styles.editButtonHero}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#004182"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0a66c2"}
          >
            ✏️ Edit Profile
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={styles.tabsContainer}>
        <div style={styles.tabs}>
          {['overview', 'experience', 'education', 'skills'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.activeTab : {}),
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab) e.currentTarget.style.backgroundColor = "#f0f0f0";
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.contentContainer}>
          {/* Left Column */}
          <div style={styles.leftColumn}>
            {/* Contact Information Card */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📞 Contact Information</h3>
              <div style={styles.infoList}>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Email:</span>
                  <span style={styles.infoValue}>{profile.email}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.infoLabel}>Phone:</span>
                  <span style={styles.infoValue}>{profile.phone || "Not provided"}</span>
                </div>
                {profile.location && (
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Location:</span>
                    <span style={styles.infoValue}>{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Links Card */}
            {(profile.linkedin_url || profile.github_url) && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🔗 Professional Links</h3>
                <div style={styles.linksList}>
                  {profile.linkedin_url && (
                    <a 
                      href={profile.linkedin_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={styles.socialLink}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                    >
                      <span style={styles.socialIcon}>💼</span>
                      LinkedIn Profile
                    </a>
                  )}
                  {profile.github_url && (
                    <a 
                      href={profile.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={styles.socialLink}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                    >
                      <span style={styles.socialIcon}>💻</span>
                      GitHub Profile
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats Card */}
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📊 Profile Stats</h3>
              <div style={styles.statsGrid}>
                <div style={styles.statItem}>
                  <div style={styles.statNumber}>
                    {profile.graduation_year ? new Date().getFullYear() - parseInt(profile.graduation_year) : "N/A"}
                  </div>
                  <div style={styles.statLabel}>Years Since Graduation</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statNumber}>
                    {profile.experience?.length || 0}
                  </div>
                  <div style={styles.statLabel}>Positions</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statNumber}>
                    {profile.skills?.length || 0}
                  </div>
                  <div style={styles.statLabel}>Skills</div>
                </div>
                <div style={styles.statItem}>
                  <div style={styles.statNumber}>
                    {profile.certifications?.length || 0}
                  </div>
                  <div style={styles.statLabel}>Certifications</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div style={styles.rightColumn}>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <>
                {/* About Section */}
                {profile.bio && (
                  <div style={styles.card}>
                    <h3 style={styles.cardTitle}>👤 About</h3>
                    <p style={styles.bioText}>{profile.bio}</p>
                  </div>
                )}

                {/* Current Role */}
                <div style={styles.card}>
                  <h3 style={styles.cardTitle}>💼 Current Position</h3>
                  <div style={styles.currentRole}>
                    <h4 style={styles.roleTitle}>
                      {profile.position || "Position not specified"}
                    </h4>
                    {profile.company_name && (
                      <p style={styles.companyName}>{profile.company_name}</p>
                    )}
                    {profile.graduation_year && (
                      <p style={styles.roleDetail}>
                        Graduated in {profile.graduation_year}
                      </p>
                    )}
                  </div>
                </div>

                {/* Skills Preview */}
                {profile.skills && profile.skills.length > 0 && (
                  <div style={styles.card}>
                    <h3 style={styles.cardTitle}>🎯 Top Skills</h3>
                    <div style={styles.skillsGrid}>
                      {profile.skills.slice(0, 8).map((skill, index) => (
                        <span key={index} style={styles.skillTag}>{skill}</span>
                      ))}
                    </div>
                    {profile.skills.length > 8 && (
                      <button 
                        style={styles.viewMoreButton}
                        onClick={() => setActiveTab('skills')}
                      >
                        View all {profile.skills.length} skills →
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>💼 Professional Experience</h3>
                {profile.experience && profile.experience.length > 0 ? (
                  <div style={styles.timelineContainer}>
                    {profile.experience.map((exp, index) => (
                      <div key={index} style={styles.timelineItem}>
                        <div style={styles.timelineDot}></div>
                        <div style={styles.experienceCard}>
                          <h4 style={styles.experienceRole}>{exp.role}</h4>
                          <p style={styles.experienceCompany}>{exp.company}</p>
                          <p style={styles.experienceDuration}>📅 {exp.duration}</p>
                          {exp.description && (
                            <p style={styles.experienceDescription}>{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <p style={styles.emptyStateText}>No experience added yet</p>
                    <button 
                      style={styles.secondaryButton}
                      onClick={() => setEditing(true)}
                    >
                      Add Experience
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Education Tab */}
            {activeTab === 'education' && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🎓 Education</h3>
                {profile.education && profile.education.length > 0 ? (
                  <div style={styles.educationList}>
                    {profile.education.map((edu, index) => (
                      <div key={index} style={styles.educationCard}>
                        <div style={styles.educationIcon}>🎓</div>
                        <div style={styles.educationContent}>
                          <h4 style={styles.educationDegree}>{edu.degree}</h4>
                          <p style={styles.educationInstitution}>{edu.institution}</p>
                          <div style={styles.educationMeta}>
                            <span>📅 {edu.year}</span>
                            {edu.grade && <span>• 📊 {edu.grade}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <p style={styles.emptyStateText}>No education details added yet</p>
                    <button 
                      style={styles.secondaryButton}
                      onClick={() => setEditing(true)}
                    >
                      Add Education
                    </button>
                  </div>
                )}

                {/* Certifications */}
                {profile.certifications && profile.certifications.length > 0 && (
                  <div style={{ marginTop: "30px" }}>
                    <h3 style={styles.cardTitle}>🏆 Certifications</h3>
                    <ul style={styles.certificationsList}>
                      {profile.certifications.map((cert, index) => (
                        <li key={index} style={styles.certificationItem}>
                          <span style={styles.certificationBullet}>✓</span>
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>🎯 Skills & Expertise</h3>
                {profile.skills && profile.skills.length > 0 ? (
                  <div style={styles.skillsGridFull}>
                    {profile.skills.map((skill, index) => (
                      <span key={index} style={styles.skillTagLarge}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <p style={styles.emptyStateText}>No skills added yet</p>
                    <button 
                      style={styles.secondaryButton}
                      onClick={() => setEditing(true)}
                    >
                      Add Skills
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
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
    gap: "20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "4px solid #e0e0e0",
    borderTop: "4px solid #0a66c2",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "16px",
    color: "#666",
  },

  // Error State
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    gap: "16px",
    padding: "20px",
  },
  errorIcon: {
    fontSize: "64px",
  },
  errorTitle: {
    fontSize: "24px",
    color: "#333",
    margin: 0,
  },
  errorText: {
    fontSize: "16px",
    color: "#666",
    textAlign: "center",
  },

  // Hero Banner
  heroBanner: {
    background: "linear-gradient(135deg, #0a66c2 0%, #004182 100%)",
    color: "white",
    padding: "40px 20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  heroContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    gap: "30px",
    flexWrap: "wrap",
  },
  profileImageSection: {
    flexShrink: 0,
  },
  profileImage: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "white",
    color: "#0a66c2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    fontWeight: "700",
    border: "4px solid rgba(255,255,255,0.3)",
  },
  heroInfo: {
    flex: 1,
    minWidth: "250px",
  },
  heroName: {
    fontSize: "36px",
    fontWeight: "700",
    margin: "0 0 8px 0",
  },
  heroPosition: {
    fontSize: "18px",
    margin: "0 0 12px 0",
    opacity: 0.95,
  },
  heroMeta: {
    fontSize: "14px",
    opacity: 0.9,
    margin: 0,
  },
  editButtonHero: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "2px solid white",
    padding: "12px 24px",
    borderRadius: "25px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  // Tabs
  tabsContainer: {
    backgroundColor: "white",
    borderBottom: "2px solid #e0e0e0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  tabs: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    gap: "8px",
    padding: "0 20px",
  },
  tab: {
    padding: "16px 24px",
    fontSize: "16px",
    fontWeight: "500",
    color: "#666",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "3px solid transparent",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  activeTab: {
    color: "#0a66c2",
    borderBottomColor: "#0a66c2",
    fontWeight: "600",
  },

  // Main Content
  mainContent: {
    padding: "40px 20px",
  },
  contentContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    gap: "30px",
  },

  // Columns
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  // Cards
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    border: "1px solid #e0e0e0",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
    paddingBottom: "12px",
    borderBottom: "2px solid #f0f0f0",
  },

  // Info List
  infoList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  infoValue: {
    fontSize: "15px",
    color: "#333",
  },

  // Links
  linksList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  socialLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "white",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  socialIcon: {
    fontSize: "20px",
  },

  // Stats
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  statItem: {
    textAlign: "center",
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0a66c2",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "13px",
    color: "#666",
  },

  // Bio
  bioText: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#444",
    margin: 0,
  },

  // Current Role
  currentRole: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    borderLeft: "4px solid #0a66c2",
  },
  roleTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 8px 0",
  },
  companyName: {
    fontSize: "16px",
    color: "#0a66c2",
    fontWeight: "500",
    margin: "0 0 8px 0",
  },
  roleDetail: {
    fontSize: "14px",
    color: "#666",
    margin: 0,
  },

  // Skills
  skillsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  skillTag: {
    backgroundColor: "#e1f0ff",
    color: "#0a66c2",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },
  skillsGridFull: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  skillTagLarge: {
    backgroundColor: "#e1f0ff",
    color: "#0a66c2",
    padding: "12px 20px",
    borderRadius: "25px",
    fontSize: "15px",
    fontWeight: "500",
  },
  viewMoreButton: {
    marginTop: "16px",
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#0a66c2",
    border: "2px solid #0a66c2",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  // Experience Timeline
  timelineContainer: {
    position: "relative",
    paddingLeft: "30px",
  },
  timelineItem: {
    position: "relative",
    marginBottom: "30px",
  },
  timelineDot: {
    position: "absolute",
    left: "-36px",
    top: "8px",
    width: "12px",
    height: "12px",
    backgroundColor: "#0a66c2",
    borderRadius: "50%",
    border: "3px solid white",
    boxShadow: "0 0 0 2px #0a66c2",
  },
  experienceCard: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    borderLeft: "3px solid #0a66c2",
  },
  experienceRole: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 8px 0",
  },
  experienceCompany: {
    fontSize: "16px",
    color: "#0a66c2",
    fontWeight: "500",
    margin: "0 0 8px 0",
  },
  experienceDuration: {
    fontSize: "14px",
    color: "#666",
    margin: "0 0 12px 0",
  },
  experienceDescription: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#444",
    margin: 0,
  },

  // Education
  educationList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  educationCard: {
    display: "flex",
    gap: "20px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  educationIcon: {
    fontSize: "32px",
    flexShrink: 0,
  },
  educationContent: {
    flex: 1,
  },
  educationDegree: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    margin: "0 0 8px 0",
  },
  educationInstitution: {
    fontSize: "16px",
    color: "#0a66c2",
    margin: "0 0 8px 0",
  },
  educationMeta: {
    fontSize: "14px",
    color: "#666",
  },

  // Certifications
  certificationsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  certificationItem: {
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "15px",
    color: "#444",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  certificationBullet: {
    color: "#0a66c2",
    fontWeight: "700",
    fontSize: "18px",
  },

  // Empty State
  emptyState: {
    textAlign: "center",
    padding: "40px 20px",
  },
  emptyStateText: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "20px",
  },

  // Buttons
  primaryButton: {
    padding: "12px 24px",
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    borderRadius: "25px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    color: "#0a66c2",
    border: "2px solid #0a66c2",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

// Add CSS keyframes for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AlumniProfile;