import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const UserProfileView = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/api/profile/${userId}`, // ✅ Correct endpoint
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setProfile(response.data);
      } catch (err) {
        console.error("Fetch profile error:", err);
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const handleSendConnection = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/connections/send",
        { to_user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Connection request sent!");
    } catch (err) {
      console.error("Send connection error:", err);
      alert(err.response?.data?.message || "Failed to send connection request");
    }
  };

  if (loading) return <div style={styles.loading}>Loading profile...</div>;
  if (error) return <div style={styles.error}>{error}</div>;
  if (!profile) return <div style={styles.error}>Profile not found</div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          ← Back
        </button>
        <h1 style={styles.profileName}>{profile.name}</h1>
        <button onClick={handleSendConnection} style={styles.connectButton}>
          Connect
        </button>
      </div>

      {/* Basic Info */}
      <div style={styles.section}>
        <div style={styles.avatar}>
          {profile.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div style={styles.basicInfo}>
          <h2 style={styles.name}>{profile.name}</h2>
          <p style={styles.email}>{profile.email}</p>
          <span style={styles.roleBadge}>{profile.role}</span>
          {profile.bio && <p style={styles.bio}>{profile.bio}</p>}
        </div>
      </div>

      {/* Student Specific Info */}
      {profile.role === "student" && (
        <>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>🎓 Education</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <strong>Graduation Year:</strong> {profile.graduation_year}
              </div>
              <div style={styles.infoItem}>
                <strong>Major:</strong> {profile.major || "N/A"}
              </div>
              <div style={styles.infoItem}>
                <strong>CGPA:</strong> {profile.cgpa || "N/A"}
              </div>
            </div>
          </div>

          {profile.skills && profile.skills.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>💼 Skills</h3>
              <div style={styles.skills}>
                {profile.skills.map((skill, index) => (
                  <span key={index} style={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.certifications && profile.certifications.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🏆 Certifications</h3>
              <ul style={styles.list}>
                {profile.certifications.map((cert, index) => (
                  <li key={index} style={styles.listItem}>{cert}</li>
                ))}
              </ul>
            </div>
          )}

          {profile.projects && profile.projects.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🚀 Projects</h3>
              <ul style={styles.list}>
                {profile.projects.map((project, index) => (
                  <li key={index} style={styles.listItem}>{project}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Alumni Specific Info */}
      {profile.role === "alumni" && (
        <>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>💼 Professional Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <strong>Company:</strong> {profile.company_name || "N/A"}
              </div>
              <div style={styles.infoItem}>
                <strong>Position:</strong> {profile.position || "N/A"}
              </div>
              <div style={styles.infoItem}>
                <strong>Graduation Year:</strong> {profile.graduation_year}
              </div>
            </div>
          </div>

          {profile.experience && profile.experience.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>📈 Experience</h3>
              {profile.experience.map((exp, index) => (
                <div key={index} style={styles.experienceItem}>
                  <strong>{exp.role}</strong> at {exp.company}
                  <div style={styles.experienceMeta}>
                    {exp.duration} {exp.description && `• ${exp.description}`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {profile.education && profile.education.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🎓 Education</h3>
              {profile.education.map((edu, index) => (
                <div key={index} style={styles.educationItem}>
                  <strong>{edu.degree}</strong> from {edu.institution}
                  <div style={styles.educationMeta}>
                    {edu.year} {edu.grade && `• ${edu.grade}`}
                  </div>
                </div>
              ))}
            </div>
          )}

          {profile.skills && profile.skills.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🛠️ Skills</h3>
              <div style={styles.skills}>
                {profile.skills.map((skill, index) => (
                  <span key={index} style={styles.skillTag}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.certifications && profile.certifications.length > 0 && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🏆 Certifications</h3>
              <ul style={styles.list}>
                {profile.certifications.map((cert, index) => (
                  <li key={index} style={styles.listItem}>{cert}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Links */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>🔗 Links</h3>
        <div style={styles.links}>
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" style={styles.link}>
              LinkedIn
            </a>
          )}
          {profile.github_url && (
            <a href={profile.github_url} target="_blank" rel="noopener noreferrer" style={styles.link}>
              GitHub
            </a>
          )}
          {profile.portfolio_url && (
            <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" style={styles.link}>
              Portfolio
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingBottom: "15px",
    borderBottom: "1px solid #e0e0e0",
  },
  backButton: {
    padding: "8px 16px",
    backgroundColor: "#f5f5f5",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
  },
  profileName: {
    margin: 0,
    color: "#333",
  },
  connectButton: {
    padding: "8px 16px",
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#0a66c2",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    marginRight: "20px",
  },
  basicInfo: {
    flex: 1,
  },
  name: {
    margin: "0 0 5px 0",
    fontSize: "28px",
    color: "#333",
  },
  email: {
    margin: "0 0 10px 0",
    color: "#666",
  },
  roleBadge: {
    display: "inline-block",
    padding: "6px 12px",
    backgroundColor: "#e1f0ff",
    color: "#0a66c2",
    borderRadius: "16px",
    fontSize: "14px",
    fontWeight: "bold",
  },
  bio: {
    marginTop: "10px",
    color: "#555",
    lineHeight: "1.5",
  },
  sectionTitle: {
    margin: "0 0 15px 0",
    color: "#333",
    fontSize: "20px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },
  infoItem: {
    padding: "10px",
    backgroundColor: "white",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
  },
  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  skillTag: {
    padding: "6px 12px",
    backgroundColor: "#0a66c2",
    color: "white",
    borderRadius: "16px",
    fontSize: "14px",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    padding: "8px 0",
    borderBottom: "1px solid #e0e0e0",
  },
  experienceItem: {
    marginBottom: "15px",
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
  },
  experienceMeta: {
    color: "#666",
    fontSize: "14px",
    marginTop: "5px",
  },
  educationItem: {
    marginBottom: "15px",
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "6px",
    border: "1px solid #e0e0e0",
  },
  educationMeta: {
    color: "#666",
    fontSize: "14px",
    marginTop: "5px",
  },
  links: {
    display: "flex",
    gap: "10px",
  },
  link: {
    padding: "8px 16px",
    backgroundColor: "#0a66c2",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    padding: "40px",
  },
  error: {
    textAlign: "center",
    color: "red",
    fontSize: "18px",
    padding: "40px",
  },
};

export default UserProfileView;