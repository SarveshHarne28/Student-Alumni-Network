import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
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
    // Add a small delay before closing
    setTimeout(() => {
      if (dropdown === 'login') {
        setShowLoginDropdown(false);
      } else {
        setShowRegisterDropdown(false);
      }
    }, 200);
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
            <a href="#about" style={styles.navLink}>About</a>
            <a href="#features" style={styles.navLink}>Features</a>
            <a href="#contact" style={styles.navLink}>Contact</a>
            
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

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Jawaharlal Nehru Engineering College
          </h1>
          <h3 style={styles.heroSubtitle}>
            A Premier Institution under MGM University, Aurangabad
          </h3>
          <p style={styles.heroDescription}>
            Connect with fellow students and alumni, discover opportunities, and grow your professional network 🚀
          </p>
          <div style={styles.heroButtons}>
            <button 
              style={styles.primaryButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#004182"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#0a66c2"}
              onClick={() => setShowRegisterDropdown(true)}
            >
              Get Started
            </button>
            <button 
              style={styles.secondaryButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f0f0f0"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
              onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={styles.aboutSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>About JNEC</h2>
          <p style={styles.aboutText}>
            Jawaharlal Nehru Engineering College (JNEC), a part of MGM University, Aurangabad,
            is a leading institution fostering innovation, knowledge, and leadership in 
            engineering and technology. With a strong network of alumni and a thriving 
            student community, JNEC is dedicated to empowering future leaders.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={styles.featuresSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>Platform Features</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🔍</div>
              <h3 style={styles.featureTitle}>Find Connections</h3>
              <p style={styles.featureDescription}>
                Search and connect with students and alumni from your institution
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>💼</div>
              <h3 style={styles.featureTitle}>Job Opportunities</h3>
              <p style={styles.featureDescription}>
                Discover internships, jobs, and projects posted by alumni
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>💬</div>
              <h3 style={styles.featureTitle}>Direct Messaging</h3>
              <p style={styles.featureDescription}>
                Connect directly with your network through real-time messaging
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🎓</div>
              <h3 style={styles.featureTitle}>Mentorship</h3>
              <p style={styles.featureDescription}>
                Get guidance from experienced alumni in your field
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>Track Applications</h3>
              <p style={styles.featureDescription}>
                Monitor your job applications and opportunity status
              </p>
            </div>
            
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🌐</div>
              <h3 style={styles.featureTitle}>Build Network</h3>
              <p style={styles.featureDescription}>
                Expand your professional network within the JNEC community
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.sectionContainer}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>5000+</div>
              <div style={styles.statLabel}>Alumni</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>3000+</div>
              <div style={styles.statLabel}>Students</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>500+</div>
              <div style={styles.statLabel}>Opportunities</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>50+</div>
              <div style={styles.statLabel}>Companies</div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="contact" style={styles.mapSection}>
        <div style={styles.sectionContainer}>
          <h2 style={styles.sectionTitle}>Find Us</h2>
          <div style={styles.mapContainer}>
            <iframe
              title="JNEC Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3757.597309002268!2d75.34333211538224!3d19.86181798664254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdb981ab0c12a53%3A0x33f1ef1e3b7e0a8d!2sJawaharlal%20Nehru%20Engineering%20College%2C%20MGM%20University%2C%20Aurangabad!5e0!3m2!1sen!2sin!4v1677494839284!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={styles.map}
              allowFullScreen=""
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>JNEC Alumni Network</h3>
            <p style={styles.footerText}>
              Connecting students and alumni for a brighter future
            </p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Quick Links</h4>
            <a href="#about" style={styles.footerLink}>About</a>
            <a href="#features" style={styles.footerLink}>Features</a>
            <a href="#contact" style={styles.footerLink}>Contact</a>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerSubtitle}>Contact</h4>
            <p style={styles.footerText}>Email: info@jnec.ac.in</p>
            <p style={styles.footerText}>Phone: +91-240-xxxxxxx</p>
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
  
  // Hero Section
  heroSection: {
    background: "linear-gradient(135deg, #0a66c2 0%, #004182 100%)",
    color: "white",
    padding: "100px 20px",
    textAlign: "center",
  },
  heroContent: {
    maxWidth: "900px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "16px",
    lineHeight: "1.2",
  },
  heroSubtitle: {
    fontSize: "24px",
    fontWeight: "400",
    marginBottom: "20px",
    opacity: 0.95,
  },
  heroDescription: {
    fontSize: "18px",
    marginBottom: "40px",
    opacity: 0.9,
    lineHeight: "1.6",
  },
  heroButtons: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  primaryButton: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "2px solid white",
    padding: "14px 32px",
    borderRadius: "25px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    backgroundColor: "white",
    color: "#0a66c2",
    border: "2px solid white",
    padding: "14px 32px",
    borderRadius: "25px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  
  // Section Styles
  sectionContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#0a66c2",
    textAlign: "center",
    marginBottom: "50px",
  },
  
  // About Section
  aboutSection: {
    padding: "80px 20px",
    backgroundColor: "#f8f9fa",
  },
  aboutText: {
    fontSize: "18px",
    lineHeight: "1.8",
    color: "#333",
    textAlign: "center",
    maxWidth: "800px",
    margin: "0 auto",
  },
  
  // Features Section
  featuresSection: {
    padding: "80px 20px",
    backgroundColor: "white",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
  },
  featureCard: {
    backgroundColor: "#f8f9fa",
    padding: "40px 30px",
    borderRadius: "12px",
    textAlign: "center",
    transition: "all 0.3s ease",
    border: "2px solid transparent",
  },
  featureIcon: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  featureTitle: {
    fontSize: "22px",
    fontWeight: "600",
    color: "#0a66c2",
    marginBottom: "12px",
  },
  featureDescription: {
    fontSize: "16px",
    color: "#666",
    lineHeight: "1.6",
  },
  
  // Stats Section
  statsSection: {
    padding: "60px 20px",
    backgroundColor: "#0a66c2",
    color: "white",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
  },
  statCard: {
    textAlign: "center",
  },
  statNumber: {
    fontSize: "48px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  statLabel: {
    fontSize: "18px",
    opacity: 0.9,
  },
  
  // Map Section
  mapSection: {
    padding: "80px 20px",
    backgroundColor: "#f8f9fa",
  },
  mapContainer: {
    marginTop: "30px",
  },
  map: {
    border: 0,
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
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