import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditAlumniProfile({ token, profile, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: "", phone: "", company_name: "", position: "", graduation_year: "",
    bio: "", linkedin_url: "", github_url: "", experience: "", education: "", 
    certifications: "", skills: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonErrors, setJsonErrors] = useState({ experience: "", education: "" });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        company_name: profile.company_name || "",
        position: profile.position || "",
        graduation_year: profile.graduation_year || "",
        bio: profile.bio || "",
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        experience: profile.experience ? JSON.stringify(profile.experience, null, 2) : "[]",
        education: profile.education ? JSON.stringify(profile.education, null, 2) : "[]",
        certifications: Array.isArray(profile.certifications) ? profile.certifications.join(", ") : "",
        skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : ""
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validate JSON fields in real-time
    if (name === 'experience' || name === 'education') {
      try {
        if (value.trim()) {
          JSON.parse(value);
          setJsonErrors(prev => ({ ...prev, [name]: "" }));
        }
      } catch (err) {
        setJsonErrors(prev => ({ ...prev, [name]: "Invalid JSON format" }));
      }
    }
  };

  const validateForm = () => {
    const errors = { ...jsonErrors };
    
    // Check required fields
    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.company_name.trim()) errors.company_name = "Company name is required";
    if (!form.position.trim()) errors.position = "Position is required";
    if (!form.graduation_year) errors.graduation_year = "Graduation year is required";

    // Validate JSON fields
    try {
      if (form.experience.trim()) JSON.parse(form.experience);
    } catch (err) {
      errors.experience = "Invalid experience JSON format";
    }

    try {
      if (form.education.trim()) JSON.parse(form.education);
    } catch (err) {
      errors.education = "Invalid education JSON format";
    }

    setJsonErrors(errors);
    return Object.values(errors).every(error => !error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    if (!validateForm()) {
      setMessage("Please fix the errors in the form");
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        company_name: form.company_name.trim(),
        position: form.position.trim(),
        graduation_year: form.graduation_year,
        bio: form.bio.trim(),
        linkedin_url: form.linkedin_url.trim(),
        github_url: form.github_url.trim(),
        experience: form.experience.trim() ? JSON.parse(form.experience) : [],
        education: form.education.trim() ? JSON.parse(form.education) : [],
        certifications: form.certifications.split(',').map(c => c.trim()).filter(c => c),
        skills: form.skills.split(',').map(s => s.trim()).filter(s => s)
      };

      const t = token || localStorage.getItem("token");
      const response = await axios.put("http://localhost:3000/api/profile/alumni", submitData, {
        headers: { 
          Authorization: `Bearer ${t}`,
          'Content-Type': 'application/json'
        }
      });
      
      setMessage("✅ Alumni profile updated successfully!");
      if (onSave) onSave();
    } catch (err) {
      console.error("Update error:", err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          "Failed to update alumni profile. Please check your connection.";
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Fixed JSON examples as strings to avoid JSX parsing issues
  const experienceExample = '[{"company": "ABC Corp", "role": "Developer", "duration": "2020-2022", "description": "Worked on..."}]';
  const educationExample = '[{"degree": "B.Tech", "institution": "JNEC", "year": "2020", "grade": "8.5 CGPA"}]';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Edit Alumni Profile</h3>
        <div style={styles.subtitle}>Update your professional information and career details</div>
      </div>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>👤</span>
            Basic Information
          </h4>
          <div style={styles.inputGrid}>
            {[
              { name: "name", placeholder: "Full Name *", required: true },
              { name: "phone", placeholder: "Phone Number" },
              { name: "company_name", placeholder: "Company Name *", required: true },
              { name: "position", placeholder: "Position *", required: true },
              { name: "graduation_year", placeholder: "Graduation Year *", type: "number", required: true },
            ].map((field) => (
              <div key={field.name} style={styles.inputWrapper}>
                <input
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.required}
                  style={{
                    ...styles.input,
                    borderColor: jsonErrors[field.name] ? '#ef4444' : '#e2e8f0',
                    background: jsonErrors[field.name] ? '#fef2f2' : '#ffffff'
                  }}
                  disabled={loading}
                />
                {jsonErrors[field.name] && (
                  <div style={styles.errorText}>{jsonErrors[field.name]}</div>
                )}
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
              placeholder="Professional bio, career summary, and achievements..."
              value={form.bio}
              onChange={handleChange}
              style={styles.textarea}
              rows="4"
              disabled={loading}
            />
          </div>
          <div style={styles.inputGrid}>
            {[
              { name: "linkedin_url", placeholder: "LinkedIn Profile URL" },
              { name: "github_url", placeholder: "GitHub Profile URL" },
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
            <span style={styles.sectionIcon}>💼</span>
            Professional Experience
          </h4>
          <div style={styles.inputWrapper}>
            <textarea
              name="experience"
              placeholder={experienceExample}
              value={form.experience}
              onChange={handleChange}
              style={{
                ...styles.textarea,
                minHeight: "140px",
                borderColor: jsonErrors.experience ? '#ef4444' : '#e2e8f0',
                background: jsonErrors.experience ? '#fef2f2' : '#ffffff',
                fontFamily: "'Fira Code', 'Courier New', monospace",
                fontSize: '13px'
              }}
              disabled={loading}
            />
            {jsonErrors.experience ? (
              <div style={styles.errorText}>{jsonErrors.experience}</div>
            ) : (
              <div style={styles.helpText}>
                Enter your work experience as JSON array. Example: {experienceExample}
              </div>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>🎓</span>
            Education
          </h4>
          <div style={styles.inputWrapper}>
            <textarea
              name="education"
              placeholder={educationExample}
              value={form.education}
              onChange={handleChange}
              style={{
                ...styles.textarea,
                minHeight: "140px",
                borderColor: jsonErrors.education ? '#ef4444' : '#e2e8f0',
                background: jsonErrors.education ? '#fef2f2' : '#ffffff',
                fontFamily: "'Fira Code', 'Courier New', monospace",
                fontSize: '13px'
              }}
              disabled={loading}
            />
            {jsonErrors.education ? (
              <div style={styles.errorText}>{jsonErrors.education}</div>
            ) : (
              <div style={styles.helpText}>
                Enter your education history as JSON array. Example: {educationExample}
              </div>
            )}
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>🚀</span>
            Skills & Certifications
          </h4>
          <div style={styles.inputGrid}>
            {[
              { name: "skills", placeholder: "Skills (e.g., JavaScript, React, Node.js, Project Management)" },
              { name: "certifications", placeholder: "Certifications (e.g., AWS Certified, PMP, Google Cloud)" },
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
        <div style={message.includes("✅") ? styles.successMessage : styles.errorMessage}>
          <span style={styles.messageIcon}>
            {message.includes("✅") ? "✅" : "❌"}
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
  helpText: {
    fontSize: "13px",
    color: "#64748b",
    marginTop: "8px",
    lineHeight: "1.4",
    padding: "8px 12px",
    background: "#f8fafc",
    borderRadius: "6px",
    border: "1px solid #e2e8f0"
  },
  errorText: {
    color: "#ef4444",
    fontSize: "13px",
    marginTop: "6px",
    fontWeight: "500",
    padding: "4px 0"
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