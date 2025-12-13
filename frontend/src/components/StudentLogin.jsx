import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentLogin({ setToken }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const navigate = useNavigate();

  // Handlers with delay for better UX
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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", form);
      const token = res.data.token;
      setToken(token);
      localStorage.setItem("token", token);
      setMessage("✅ Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Login failed. Please try again.");
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
              <h1 style={styles.brandTitle}>Welcome Back! 👋</h1>
              <p style={styles.brandSubtitle}>
                Sign in to access your student account and explore opportunities
              </p>
            </div>
            
            <div style={styles.benefitsSection}>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>💼</div>
                <div>
                  <h3 style={styles.benefitTitle}>Job Opportunities</h3>
                  <p style={styles.benefitText}>Access exclusive internships and job postings</p>
                </div>
              </div>
              
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>🎓</div>
                <div>
                  <h3 style={styles.benefitTitle}>Alumni Network</h3>
                  <p style={styles.benefitText}>Connect with successful alumni for guidance</p>
                </div>
              </div>
              
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>💬</div>
                <div>
                  <h3 style={styles.benefitTitle}>Direct Messaging</h3>
                  <p style={styles.benefitText}>Chat with your connections in real-time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div style={styles.rightPanel}>
            <div style={styles.formContainer}>
              <div style={styles.formHeader}>
                <h2 style={styles.formTitle}>👨‍🎓 Student Login</h2>
                <p style={styles.formSubtitle}>Enter your credentials to continue</p>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email Address</label>
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
                  <label style={styles.label}>Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    style={styles.input}
                    onFocus={(e) => e.target.style.borderColor = "#0a66c2"}
                    onBlur={(e) => e.target.style.borderColor = "#d0d0d0"}
                  />
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
                  {isLoading ? "Logging in..." : "Login to Your Account"}
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
                  Don't have an account?{" "}
                  <span 
                    style={styles.link}
                    onClick={() => navigate("/student-register")}
                    onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
                    onMouseLeave={(e) => e.target.style.textDecoration = "none"}
                  >
                    Register here
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
    maxWidth: "1100px",
    width: "100%",
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    overflow: "hidden",
    minHeight: "600px",
  },
  
  // Left Panel Styles
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #0a66c2 0%, #004182 100%)",
    padding: "60px 50px",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  brandSection: {
    marginBottom: "50px",
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
    gap: "30px",
  },
  benefitItem: {
    display: "flex",
    gap: "20px",
    alignItems: "flex-start",
  },
  benefitIcon: {
    fontSize: "32px",
    flexShrink: 0,
  },
  benefitTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  benefitText: {
    fontSize: "14px",
    opacity: 0.9,
    lineHeight: "1.5",
  },
  
  // Right Panel Styles
  rightPanel: {
    flex: 1,
    padding: "60px 50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    maxWidth: "400px",
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
    gap: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
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
  
  // Form Footer (inside the form)
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