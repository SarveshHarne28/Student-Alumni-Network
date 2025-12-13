import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditStudentProfile({ token, profile, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "", phone: "", graduation_year: "", major: "", cgpa: "", 
    bio: "", github_url: "", linkedin_url: "", portfolio_url: "", 
    skills: "", certifications: "", projects: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        graduation_year: profile.graduation_year || "",
        major: profile.major || "",
        cgpa: profile.cgpa || "",
        bio: profile.bio || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        portfolio_url: profile.portfolio_url || "",
        skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : (profile.skills || ""),
        certifications: Array.isArray(profile.certifications) ? profile.certifications.join(", ") : (profile.certifications || ""),
        projects: Array.isArray(profile.projects) ? profile.projects.join(", ") : (profile.projects || "")
      });
    }
  }, [profile]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    
    try {
      const submitData = {
        ...form,
        skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(s => s) : [],
        certifications: form.certifications ? form.certifications.split(',').map(c => c.trim()).filter(c => c) : [],
        projects: form.projects ? form.projects.split(',').map(p => p.trim()).filter(p => p) : []
      };

      const t = token || localStorage.getItem("token");
      const response = await axios.put("http://localhost:3000/api/profile/student", submitData, {
        headers: { Authorization: `Bearer ${t}` }
      });
      
      setMessage("Profile updated successfully!");
      if (onSave) onSave();
    } catch (err) {
      console.error("Update error:", err);
      setMessage(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Edit Student Profile</h3>
        <div style={styles.subtitle}>Update your academic and professional information</div>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>📋</span>
            Basic Information
          </h4>
          <div style={styles.inputGrid}>
            {[
              { name: "name", placeholder: "Full Name", required: true },
              { name: "phone", placeholder: "Phone Number" },
              { name: "graduation_year", placeholder: "Graduation Year", type: "number", required: true },
              { name: "major", placeholder: "Major", required: true },
              { name: "cgpa", placeholder: "CGPA", type: "number", step: "0.01" },
            ].map((field) => (
              <div key={field.name} style={styles.inputWrapper}>
                <input
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  style={styles.input}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>🌐</span>
            Profile & Links
          </h4>
          <div style={styles.inputWrapper}>
            <textarea
              name="bio"
              placeholder="Tell us about yourself, your interests, and career goals..."
              value={form.bio}
              onChange={handleChange}
              style={styles.textarea}
              disabled={loading}
              rows={4}
            />
          </div>
          <div style={styles.inputGrid}>
            {[
              { name: "github_url", placeholder: "GitHub Profile URL" },
              { name: "linkedin_url", placeholder: "LinkedIn Profile URL" },
              { name: "portfolio_url", placeholder: "Portfolio Website URL" },
            ].map((field) => (
              <div key={field.name} style={styles.inputWrapper}>
                <input
                  name={field.name}
                  type="url"
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={loading}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>🚀</span>
            Skills & Achievements
          </h4>
          <div style={styles.inputGrid}>
            {[
              { name: "skills", placeholder: "Skills (e.g., JavaScript, Python, React)" },
              { name: "certifications", placeholder: "Certifications (e.g., AWS, Google Cloud)" },
              { name: "projects", placeholder: "Projects (e.g., E-commerce App, ML Model)" },
            ].map((field) => (
              <div key={field.name} style={styles.inputWrapper}>
                <input
                  name={field.name}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={loading}
                />
                <div style={styles.hint}>Separate with commas</div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button 
            type="button" 
            onClick={onCancel} 
            style={{
              ...styles.cancelButton,
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            style={{
              ...styles.saveButton,
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>

      {message && (
        <div style={message.includes("successfully") ? styles.successMessage : styles.errorMessage}>
          <span style={styles.messageIcon}>
            {message.includes("successfully") ? "✅" : "❌"}
          </span>
          {message}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { 
    maxWidth: "800px", 
    margin: "20px auto", 
    padding: "30px", 
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", 
    borderRadius: "16px", 
    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
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
    fontSize: "28px",
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
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px"
  },
  section: { 
    padding: "24px", 
    background: "#ffffff", 
    borderRadius: "12px", 
    border: "1px solid #e2e8f0",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
    transition: "all 0.2s ease"
  },
  sectionTitle: { 
    margin: "0 0 20px 0", 
    color: "#1e293b", 
    fontSize: "18px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  sectionIcon: {
    fontSize: "20px"
  },
  inputGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px"
  },
  inputWrapper: {
    position: "relative"
  },
  input: { 
    width: "100%", 
    padding: "14px 16px", 
    border: "2px solid #e2e8f0", 
    borderRadius: "10px", 
    fontSize: "15px",
    fontWeight: "400",
    color: "#1e293b",
    background: "#ffffff",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    outline: "none"
  },
  textarea: { 
    width: "100%", 
    padding: "14px 16px", 
    border: "2px solid #e2e8f0", 
    borderRadius: "10px", 
    fontSize: "15px",
    fontWeight: "400",
    color: "#1e293b",
    background: "#ffffff",
    transition: "all 0.2s ease",
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
    minHeight: "100px",
    fontFamily: "inherit"
  },
  hint: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "4px",
    marginLeft: "4px"
  },
  buttonGroup: { 
    display: "flex", 
    gap: "12px", 
    justifyContent: "flex-end",
    marginTop: "8px"
  },
  cancelButton: { 
    padding: "14px 28px", 
    border: "2px solid #e2e8f0", 
    borderRadius: "10px", 
    background: "#ffffff", 
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none"
  },
  saveButton: { 
    padding: "14px 28px", 
    border: "none", 
    borderRadius: "10px", 
    background: "linear-gradient(135deg, #0ea5e9, #3b82f6)", 
    color: "white", 
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    outline: "none",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  buttonDisabled: {
    opacity: "0.6",
    cursor: "not-allowed",
    transform: "none"
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid transparent",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite"
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
    marginTop: "20px"
  },
  successMessage: { 
    padding: "16px",
    background: "linear-gradient(135deg, #f0fdf4, #bbf7d0)",
    color: "#16a34a",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "500",
    border: "1px solid #bbf7d0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "20px"
  },
  messageIcon: {
    fontSize: "16px"
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