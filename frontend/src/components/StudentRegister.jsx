import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentRegister() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    graduation_year: "",
    major: "",
    cgpa: "",
    bio: "",
    github_url: "",
    linkedin_url: "",
    portfolio_url: "",
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [certInput, setCertInput] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectInput, setProjectInput] = useState("");

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = (dropdown) => {
    if (dropdown === 'login') {
      setShowLoginDropdown(true);
    } else {
      setShowRegisterDropdown(true);
    }
  };

  const handleMouseLeave = (dropdown) => {
    setTimeout(() => {
      if (dropdown === 'login') {
        setShowLoginDropdown(false);
      } else {
        setShowRegisterDropdown(false);
      }
    }, 200);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Skills handlers
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput("");
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  // Certifications handlers
  const handleCertKeyDown = (e) => {
    if (e.key === 'Enter' && certInput.trim()) {
      e.preventDefault();
      setCertifications([...certifications, certInput.trim()]);
      setCertInput("");
    }
  };

  const removeCert = (index) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  // Projects handlers
  const handleProjectKeyDown = (e) => {
    if (e.key === 'Enter' && projectInput.trim()) {
      e.preventDefault();
      setProjects([...projects, projectInput.trim()]);
      setProjectInput("");
    }
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const submitData = {
      ...form,
      skills,
      certifications,
      projects
    };

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register/student", submitData);
      setMessage("✅ Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/student-login");
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <h2 style={styles.logo} onClick={() => navigate("/")}>
            JNEC <span style={styles.logoSubtext}>Alumni Network</span>
          </h2>
          
          <div style={styles.navLinks}>
            <a href="/#about" style={styles.navLink}>About</a>
            <a href="/#features" style={styles.navLink}>Features</a>
            <a href="/#contact" style={styles.navLink}>Contact</a>
            
            {/* Login Dropdown */}
            <div
              style={styles.dropdown}
              onMouseEnter={() => handleMouseEnter('login')}
              onMouseLeave={() => handleMouseLeave('login')}
            >
              <button style={styles.dropdownButton}>
                Login ▼
              </button>
              {showLoginDropdown && (
                <div style={styles.dropdownMenu}>
                  <div
                    onClick={() => {
                      setShowLoginDropdown(false);
                      navigate("/student-login");
                    }}
                    style={styles.dropdownItem}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  >
                    👨‍🎓 Student Login
                  </div>
                  <div
                    onClick={() => {
                      setShowLoginDropdown(false);
                      navigate("/alumni-login");
                    }}
                    style={styles.dropdownItem}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  >
                    🎓 Alumni Login
                  </div>
                </div>
              )}
            </div>

            {/* Register Dropdown */}
            <div
              style={styles.dropdown}
              onMouseEnter={() => handleMouseEnter('register')}
              onMouseLeave={() => handleMouseLeave('register')}
            >
              <button style={styles.registerButton}>
                Register ▼
              </button>
              {showRegisterDropdown && (
                <div style={styles.dropdownMenu}>
                  <div
                    onClick={() => {
                      setShowRegisterDropdown(false);
                      navigate("/student-register");
                    }}
                    style={styles.dropdownItem}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  >
                    👨‍🎓 Student Register
                  </div>
                  <div
                    onClick={() => {
                      setShowRegisterDropdown(false);
                      navigate("/alumni-register");
                    }}
                    style={styles.dropdownItem}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  >
                    🎓 Alumni Register
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.container}>
          {/* Left Side - Illustration/Info */}
          <div style={styles.leftPanel}>
            <div style={styles.brandSection}>
              <h1 style={styles.brandTitle}>Join JNEC Network! 🚀</h1>
              <p style={styles.brandSubtitle}>
                Create your student profile and unlock endless opportunities
              </p>
            </div>
            
            <div style={styles.benefitsSection}>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>🎯</div>
                <div>
                  <h3 style={styles.benefitTitle}>Build Your Profile</h3>
                  <p style={styles.benefitText}>Showcase your skills, projects, and achievements</p>
                </div>
              </div>
              
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>🤝</div>
                <div>
                  <h3 style={styles.benefitTitle}>Connect with Alumni</h3>
                  <p style={styles.benefitText}>Get mentorship from experienced professionals</p>
                </div>
              </div>
              
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>💼</div>
                <div>
                  <h3 style={styles.benefitTitle}>Career Opportunities</h3>
                  <p style={styles.benefitText}>Access internships and job postings exclusively</p>
                </div>
              </div>

              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>📚</div>
                <div>
                  <h3 style={styles.benefitTitle}>Learn & Grow</h3>
                  <p style={styles.benefitText}>Participate in workshops and events</p>
                </div>
              </div>
            </div>

            <div style={styles.statsSection}>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>500+</div>
                <div style={styles.statLabel}>Active Students</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>1000+</div>
                <div style={styles.statLabel}>Alumni Network</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>200+</div>
                <div style={styles.statLabel}>Job Placements</div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div style={styles.rightPanel}>
            <div style={styles.formContainer}>
              <div style={styles.formHeader}>
                <h2 style={styles.formTitle}>👨‍🎓 Student Registration</h2>
                <p style={styles.formSubtitle}>Fill in your details to get started</p>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                {/* Basic Information */}
                <div style={styles.sectionContainer}>
                  <h3 style={styles.sectionTitle}>📋 Basic Information</h3>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Full Name *</label>
                    <input
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                      onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Email Address *</label>
                    <input
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                      onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Password *</label>
                    <input
                      name="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                      onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Phone Number</label>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+91 1234567890"
                      value={form.phone}
                      onChange={handleChange}
                      style={styles.input}
                      onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                      onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                    />
                  </div>
                </div>

                {/* Academic Details */}
                <div style={styles.sectionContainer}>
                  <h3 style={styles.sectionTitle}>🎓 Academic Details</h3>
                  
                  <div style={styles.inputRow}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Major *</label>
                      <input
                        name="major"
                        type="text"
                        placeholder="e.g., Computer Science"
                        value={form.major}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                        onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                      />
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Graduation Year *</label>
                      <input
                        name="graduation_year"
                        type="number"
                        placeholder="2025"
                        value={form.graduation_year}
                        onChange={handleChange}
                        required
                        style={styles.input}
                        onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                        onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                      />
                    </div>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>CGPA</label>
                    <input
                      name="cgpa"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 8.5"
                      value={form.cgpa}
                      onChange={handleChange}
                      style={styles.input}
                      onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                      onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                    />
                  </div>
                </div>

                {/* Profile Details */}
                <div style={styles.sectionContainer}>
                  <h3 style={styles.sectionTitle}>👤 Profile Details</h3>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Bio</label>
                    <textarea
                      name="bio"
                      placeholder="Tell us about yourself, your interests, and career goals..."
                      value={form.bio}
                      onChange={handleChange}
                      style={styles.textarea}
                      onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                      onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>GitHub URL</label>
                    <input
                      name="github_url"
                      type="url"
                      placeholder="https://github.com/yourusername"
                      value={form.github_url}
                      onChange={handleChange}
                      style={styles.input}
                      onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                      onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>LinkedIn URL</label>
                    <input
                      name="linkedin_url"
                      type="url"
                      placeholder="https://linkedin.com/in/yourusername"
                      value={form.linkedin_url}
                      onChange={handleChange}
                      style={styles.input}
                      onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                      onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                    />
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Portfolio URL</label>
                    <input
                      name="portfolio_url"
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={form.portfolio_url}
                      onChange={handleChange}
                      style={styles.input}
                      onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                      onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                    />
                  </div>
                </div>

                {/* Skills & Achievements */}
                <div style={styles.sectionContainer}>
                  <h3 style={styles.sectionTitle}>🏆 Skills & Achievements</h3>
                  
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Skills</label>
                    <input
                      type="text"
                      placeholder="Type a skill and press Enter"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      style={styles.input}
                      onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                      onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                    />
                    <div style={styles.tagsContainer}>
                      {skills.map((skill, index) => (
                        <div key={index} style={styles.tag}>
                          {skill}
                          <span 
                            style={styles.tagClose}
                            onClick={() => removeSkill(index)}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Certifications</label>
                    <input
                      type="text"
                      placeholder="Type a certification and press Enter"
                      value={certInput}
                      onChange={(e) => setCertInput(e.target.value)}
                      onKeyDown={handleCertKeyDown}
                      style={styles.input}
                      onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                      onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                    />
                    <div style={styles.tagsContainer}>
                      {certifications.map((cert, index) => (
                        <div key={index} style={styles.tag}>
                          {cert}
                          <span 
                            style={styles.tagClose}
                            onClick={() => removeCert(index)}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Projects</label>
                    <input
                      type="text"
                      placeholder="Type a project name and press Enter"
                      value={projectInput}
                      onChange={(e) => setProjectInput(e.target.value)}
                      onKeyDown={handleProjectKeyDown}
                      style={styles.input}
                      onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                      onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                    />
                    <div style={styles.tagsContainer}>
                      {projects.map((project, index) => (
                        <div key={index} style={styles.tag}>
                          {project}
                          <span 
                            style={styles.tagClose}
                            onClick={() => removeProject(index)}
                          >
                            ×
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    ...styles.submitButton,
                    opacity: isLoading ? 0.7 : 1,
                    cursor: isLoading ? "not-allowed" : "pointer",
                  }}
                  onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = "#004182")}
                  onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = "#0a66c2")}
                >
                  {isLoading ? "Registering..." : "Create My Account"}
                </button>
              </form>

              {message && (
                <div style={{
                  ...styles.message,
                  backgroundColor: message.includes("success") ? "#d4edda" : "#f8d7da",
                  color: message.includes("success") ? "#155724" : "#721c24",
                  borderColor: message.includes("success") ? "#c3e6cb" : "#f5c6cb",
                }}>
                  {message}
                </div>
              )}

              <div style={styles.formFooter}>
                <p style={styles.footerText}>
                  Already have an account?{" "}
                  <span 
                    style={styles.link}
                    onClick={() => navigate("/student-login")}
                    onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                    onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                  >
                    Login here
                  </span>
                </p>
                <p style={styles.footerText}>
                  <span 
                    style={styles.link}
                    onClick={() => navigate("/")}
                    onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                    onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                  >
                    ← Back to Home
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>JNEC Alumni Network</h3>
            <p style={styles.footerTextContent}>
              Connecting students and alumni for a brighter future
            </p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Quick Links</h4>
            <a href="/#about" style={styles.footerLink}>About</a>
            <a href="/#features" style={styles.footerLink}>Features</a>
            <a href="/#contact" style={styles.footerLink}>Contact</a>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Contact</h4>
            <p style={styles.footerTextContent}>Email: info@jnec.ac.in</p>
            <p style={styles.footerTextContent}>Phone: +91-240-xxxxxxx</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.footerCopyright}>
            © {new Date().getFullYear()} JNEC - MGM University | All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  pageWrapper: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    fontFamily: "'Segoe UI', system-ui, Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  
  // Navbar Styles
  navbar: {
    backgroundColor: "white",
    borderBottom: "1px solid #e0e0e0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  navContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
  },
  logo: {
    color: "#0a66c2",
    margin: 0,
    cursor: "pointer",
    fontSize: "24px",
    fontWeight: "700",
  },
  logoSubtext: {
    fontSize: "14px",
    color: "#666",
    fontWeight: "400",
  },
  navLinks: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: "16px",
    fontWeight: "500",
    transition: "color 0.3s ease",
    cursor: "pointer",
  },
  dropdown: {
    position: "relative",
  },
  dropdownButton: {
    background: "none",
    border: "1px solid #d0d0d0",
    color: "#333",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  registerButton: {
    background: "#0a66c2",
    border: "none",
    color: "white",
    padding: "8px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  dropdownMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    backgroundColor: "white",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    minWidth: "180px",
    overflow: "hidden",
    zIndex: 1001,
  },
  dropdownItem: {
    padding: "12px 20px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    fontSize: "15px",
    color: "#333",
  },
  
  // Main Content Area
  mainContent: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  
  container: {
    display: "flex",
    maxWidth: "1400px",
    width: "100%",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    overflow: "hidden",
    minHeight: "800px",
  },
  
  // Left Panel Styles
  leftPanel: {
    flex: "0 0 400px",
    background: "linear-gradient(135deg, #0a66c2 0%, #004182 100%)",
    padding: "60px 40px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  brandSection: {
    marginBottom: "40px",
  },
  brandTitle: {
    fontSize: "36px",
    fontWeight: "700",
    marginBottom: "16px",
    lineHeight: "1.2",
  },
  brandSubtitle: {
    fontSize: "18px",
    opacity: 0.9,
    lineHeight: "1.6",
  },
  benefitsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    marginBottom: "40px",
  },
  benefitItem: {
    display: "flex",
    gap: "16px",
    alignItems: "flex-start",
  },
  benefitIcon: {
    fontSize: "28px",
    flexShrink: 0,
  },
  benefitTitle: {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "4px",
  },
  benefitText: {
    fontSize: "13px",
    opacity: 0.9,
    lineHeight: "1.5",
  },
  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    paddingTop: "30px",
    borderTop: "1px solid rgba(255,255,255,0.2)",
  },
  statItem: {
    textAlign: "center",
  },
  statNumber: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "12px",
    opacity: 0.9,
  },
  
  // Right Panel Styles
  rightPanel: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
    maxHeight: "900px",
  },
  formContainer: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
  },
  formHeader: {
    textAlign: "center",
    marginBottom: "40px",
  },
  formTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0a66c2",
    marginBottom: "8px",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#666",
  },
  
  // Form Styles
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  sectionContainer: {
    padding: "24px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
  },
  inputRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    border: "2px solid #d0d0d0",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "white",
  },
  textarea: {
    width: "100%",
    padding: "14px 16px",
    fontSize: "15px",
    border: "2px solid #d0d0d0",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
    minHeight: "100px",
    resize: "vertical",
    fontFamily: "'Segoe UI', system-ui, Arial, sans-serif",
    backgroundColor: "white",
  },
  tagsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "8px",
    minHeight: "40px",
    padding: "8px",
    backgroundColor: "white",
    borderRadius: "8px",
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#0a66c2",
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "500",
  },
  tagClose: {
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: "700",
    lineHeight: "1",
    transition: "opacity 0.2s ease",
    opacity: 0.8,
  },
  submitButton: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#0a66c2",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    marginTop: "8px",
  },
  message: {
    marginTop: "20px",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
    border: "1px solid",
  },
  
  // Form Footer
  formFooter: {
    marginTop: "30px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  footerText: {
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "#0a66c2",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  
  // Page Footer Styles
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
  footerTextContent: {
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