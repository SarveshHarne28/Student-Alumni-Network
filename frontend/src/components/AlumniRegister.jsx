import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AlumniRegister() {
  const [form, setForm] = useState({
    email: "", password: "", name: "", phone: "", company_name: "", 
    position: "", graduation_year: "", bio: "", linkedin_url: "", github_url: ""
  });

  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [certifications, setCertifications] = useState([]);
  const [certInput, setCertInput] = useState("");
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [experienceStep, setExperienceStep] = useState(0);
  const [educationStep, setEducationStep] = useState(0);
  
  const [currentExperience, setCurrentExperience] = useState({
    company: "", role: "", duration: "", description: ""
  });
  
  const [currentEducation, setCurrentEducation] = useState({
    institution: "", degree: "", year: "", grade: ""
  });

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

  // Experience Functions
  const startAddExperience = () => {
    setExperienceStep(1);
    setCurrentExperience({
      company: "", role: "", duration: "", description: ""
    });
  };

  const handleExperienceChange = (e) => {
    setCurrentExperience({ ...currentExperience, [e.target.name]: e.target.value });
  };

  const saveExperience = () => {
    if (!currentExperience.company || !currentExperience.role || !currentExperience.duration) {
      alert("Please fill in all required fields");
      return;
    }
    setExperience([...experience, currentExperience]);
    setExperienceStep(0);
  };

  const removeExperience = (index) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  // Education Functions
  const startAddEducation = () => {
    setEducationStep(1);
    setCurrentEducation({
      institution: "", degree: "", year: "", grade: ""
    });
  };

  const handleEducationChange = (e) => {
    setCurrentEducation({ ...currentEducation, [e.target.name]: e.target.value });
  };

  const saveEducation = () => {
    if (!currentEducation.institution || !currentEducation.degree) {
      alert("Please fill in institution and degree");
      return;
    }
    setEducation([...education, currentEducation]);
    setEducationStep(0);
  };

  const removeEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  // Form Navigation
  const nextStep = () => {
    if (currentStep === 1 && (!form.email || !form.password || !form.name || !form.company_name || !form.position || !form.graduation_year)) {
      alert("Please fill in all required fields");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const submitData = {
      ...form,
      skills,
      certifications,
      experience,
      education
    };

    try {
      const res = await axios.post("http://localhost:3000/api/auth/register/alumni", submitData);
      setMessage("✅ Registration successful! You can now login.");
      setTimeout(() => {
        navigate("/alumni-login");
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
                  >
                    👨‍🎓 Student Login
                  </div>
                  <div
                    onClick={() => {
                      setShowLoginDropdown(false);
                      navigate("/alumni-login");
                    }}
                    style={styles.dropdownItem}
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
                  >
                    👨‍🎓 Student Register
                  </div>
                  <div
                    onClick={() => {
                      setShowRegisterDropdown(false);
                      navigate("/alumni-register");
                    }}
                    style={styles.dropdownItem}
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
          {/* Left Side */}
          <div style={styles.leftPanel}>
            <div style={styles.brandSection}>
              <h1 style={styles.brandTitle}>Welcome Back Alumni! 🎓</h1>
              <p style={styles.brandSubtitle}>
                Reconnect with your alma mater and inspire the next generation
              </p>
            </div>
            
            <div style={styles.benefitsSection}>
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>🤝</div>
                <div>
                  <h3 style={styles.benefitTitle}>Mentor Students</h3>
                  <p style={styles.benefitText}>Share your experience and guide current students</p>
                </div>
              </div>
              
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>💼</div>
                <div>
                  <h3 style={styles.benefitTitle}>Career Networking</h3>
                  <p style={styles.benefitText}>Connect with fellow alumni in your industry</p>
                </div>
              </div>
              
              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>📚</div>
                <div>
                  <h3 style={styles.benefitTitle}>Give Back</h3>
                  <p style={styles.benefitText}>Participate in campus events and workshops</p>
                </div>
              </div>

              <div style={styles.benefitItem}>
                <div style={styles.benefitIcon}>🚀</div>
                <div>
                  <h3 style={styles.benefitTitle}>Grow Together</h3>
                  <p style={styles.benefitText}>Access exclusive alumni-only opportunities</p>
                </div>
              </div>
            </div>

            <div style={styles.statsSection}>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>1000+</div>
                <div style={styles.statLabel}>Alumni Network</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>50+</div>
                <div style={styles.statLabel}>Industries</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>200+</div>
                <div style={styles.statLabel}>Mentors</div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div style={styles.rightPanel}>
            <div style={styles.formContainer}>
              <div style={styles.formHeader}>
                <h2 style={styles.formTitle}>🎓 Alumni Registration</h2>
                <p style={styles.formSubtitle}>Step {currentStep} of 3: {
                  currentStep === 1 ? "Basic Information" :
                  currentStep === 2 ? "Professional Details" :
                  "Skills & Profile"
                }</p>
                
                <div style={styles.progressBar}>
                  <div style={{...styles.progressStep, ...(currentStep >= 1 ? styles.progressActive : {})}}>1</div>
                  <div style={styles.progressLine}></div>
                  <div style={{...styles.progressStep, ...(currentStep >= 2 ? styles.progressActive : {})}}>2</div>
                  <div style={styles.progressLine}></div>
                  <div style={{...styles.progressStep, ...(currentStep >= 3 ? styles.progressActive : {})}}>3</div>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={styles.form}>
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div style={styles.stepContainer}>
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
                      />
                    </div>

                    <div style={styles.inputRow}>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Current Company *</label>
                        <input
                          name="company_name"
                          type="text"
                          placeholder="e.g., Google, Microsoft"
                          value={form.company_name}
                          onChange={handleChange}
                          required
                          style={styles.input}
                        />
                      </div>

                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Position *</label>
                        <input
                          name="position"
                          type="text"
                          placeholder="e.g., Software Engineer"
                          value={form.position}
                          onChange={handleChange}
                          required
                          style={styles.input}
                        />
                      </div>
                    </div>

                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Graduation Year *</label>
                      <input
                        name="graduation_year"
                        type="number"
                        placeholder="2015"
                        value={form.graduation_year}
                        onChange={handleChange}
                        required
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.stepActions}>
                      <button
                        type="button"
                        onClick={nextStep}
                        style={styles.primaryButton}
                      >
                        Next: Professional Details →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Professional Details */}
                {currentStep === 2 && (
                  <div style={styles.stepContainer}>
                    <h3 style={styles.sectionTitle}>💼 Professional Details</h3>
                    
                    {/* Experience Section */}
                    <div style={styles.sectionContainer}>
                      <div style={styles.sectionHeader}>
                        <h4 style={styles.subsectionTitle}>Work Experience</h4>
                        <button
                          type="button"
                          onClick={startAddExperience}
                          style={styles.addButton}
                        >
                          + Add Experience
                        </button>
                      </div>

                      {experience.map((exp, index) => (
                        <div key={index} style={styles.itemCard}>
                          <div style={styles.itemHeader}>
                            <strong>{exp.role}</strong> at {exp.company}
                            <span 
                              style={styles.removeButton}
                              onClick={() => removeExperience(index)}
                            >
                              ×
                            </span>
                          </div>
                          {exp.duration && (
                            <div style={styles.itemDetail}>
                              {exp.duration}
                            </div>
                          )}
                        </div>
                      ))}

                      {experienceStep > 0 && (
                        <div style={styles.wizardContainer}>
                          <h5 style={styles.wizardTitle}>Add Experience</h5>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Company *</label>
                            <input
                              name="company"
                              type="text"
                              placeholder="Company name"
                              value={currentExperience.company}
                              onChange={handleExperienceChange}
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Role/Position *</label>
                            <input
                              name="role"
                              type="text"
                              placeholder="Your job title"
                              value={currentExperience.role}
                              onChange={handleExperienceChange}
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Duration *</label>
                            <input
                              name="duration"
                              type="text"
                              placeholder="e.g., Jan 2020 - Present, 2020-2022"
                              value={currentExperience.duration}
                              onChange={handleExperienceChange}
                              style={styles.input}
                              required
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Description</label>
                            <textarea
                              name="description"
                              placeholder="Describe your responsibilities and achievements..."
                              value={currentExperience.description}
                              onChange={handleExperienceChange}
                              style={styles.textarea}
                              rows="3"
                            />
                          </div>
                          <div style={styles.wizardActions}>
                            <button type="button" onClick={() => setExperienceStep(0)} style={styles.secondaryButton}>
                              Cancel
                            </button>
                            <button type="button" onClick={saveExperience} style={styles.primaryButton}>
                              Save Experience
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Education Section */}
                    <div style={styles.sectionContainer}>
                      <div style={styles.sectionHeader}>
                        <h4 style={styles.subsectionTitle}>Education</h4>
                        <button
                          type="button"
                          onClick={startAddEducation}
                          style={styles.addButton}
                        >
                          + Add Education
                        </button>
                      </div>

                      {education.map((edu, index) => (
                        <div key={index} style={styles.itemCard}>
                          <div style={styles.itemHeader}>
                            <strong>{edu.degree}</strong> at {edu.institution}
                            <span 
                              style={styles.removeButton}
                              onClick={() => removeEducation(index)}
                            >
                              ×
                            </span>
                          </div>
                          {edu.year && (
                            <div style={styles.itemDetail}>Year: {edu.year}</div>
                          )}
                          {edu.grade && (
                            <div style={styles.itemDetail}>Grade: {edu.grade}</div>
                          )}
                        </div>
                      ))}

                      {educationStep > 0 && (
                        <div style={styles.wizardContainer}>
                          <h5 style={styles.wizardTitle}>Add Education</h5>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Institution *</label>
                            <input
                              name="institution"
                              type="text"
                              placeholder="University/College name"
                              value={currentEducation.institution}
                              onChange={handleEducationChange}
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Degree *</label>
                            <input
                              name="degree"
                              type="text"
                              placeholder="e.g., B.Tech, MBA"
                              value={currentEducation.degree}
                              onChange={handleEducationChange}
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Year</label>
                            <input
                              name="year"
                              type="text"
                              placeholder="e.g., 2015-2019, 2020"
                              value={currentEducation.year}
                              onChange={handleEducationChange}
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Grade/GPA</label>
                            <input
                              name="grade"
                              type="text"
                              placeholder="e.g., 8.5 CGPA, First Class"
                              value={currentEducation.grade}
                              onChange={handleEducationChange}
                              style={styles.input}
                            />
                          </div>
                          <div style={styles.wizardActions}>
                            <button type="button" onClick={() => setEducationStep(0)} style={styles.secondaryButton}>
                              Cancel
                            </button>
                            <button type="button" onClick={saveEducation} style={styles.primaryButton}>
                              Save Education
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={styles.stepActions}>
                      <button
                        type="button"
                        onClick={prevStep}
                        style={styles.secondaryButton}
                      >
                        ← Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        style={styles.primaryButton}
                      >
                        Next: Skills & Profile →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Skills & Profile */}
                {currentStep === 3 && (
                  <div style={styles.stepContainer}>
                    <h3 style={styles.sectionTitle}>🎯 Skills & Profile</h3>
                    
                    {/* Skills */}
                    <div style={styles.sectionContainer}>
                      <h4 style={styles.subsectionTitle}>Skills</h4>
                      <div style={styles.inputGroup}>
                        <input
                          type="text"
                          placeholder="Type a skill and press Enter"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={handleSkillKeyDown}
                          style={styles.input}
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
                    </div>

                    {/* Certifications */}
                    <div style={styles.sectionContainer}>
                      <h4 style={styles.subsectionTitle}>Certifications</h4>
                      <div style={styles.inputGroup}>
                        <input
                          type="text"
                          placeholder="Type a certification and press Enter"
                          value={certInput}
                          onChange={(e) => setCertInput(e.target.value)}
                          onKeyDown={handleCertKeyDown}
                          style={styles.input}
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
                    </div>

                    {/* Profile Details */}
                    <div style={styles.sectionContainer}>
                      <h4 style={styles.subsectionTitle}>Profile Details</h4>
                      <div style={styles.inputGroup}>
                        <label style={styles.label}>Professional Bio</label>
                        <textarea
                          name="bio"
                          placeholder="Tell us about your professional journey, expertise, and interests..."
                          value={form.bio}
                          onChange={handleChange}
                          style={styles.textarea}
                          rows="4"
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
                        />
                      </div>
                    </div>

                    <div style={styles.stepActions}>
                      <button
                        type="button"
                        onClick={prevStep}
                        style={styles.secondaryButton}
                      >
                        ← Back
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                          ...styles.primaryButton,
                          opacity: isLoading ? 0.7 : 1,
                          cursor: isLoading ? "not-allowed" : "pointer",
                        }}
                      >
                        {isLoading ? "Registering..." : "Complete Registration"}
                      </button>
                    </div>
                  </div>
                )}
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
                    onClick={() => navigate("/alumni-login")}
                  >
                    Login here
                  </span>
                </p>
                <p style={styles.footerText}>
                  <span 
                    style={styles.link}
                    onClick={() => navigate("/")}
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
    marginBottom: "20px",
  },
  progressBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  progressStep: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#e0e0e0",
    color: "#666",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "600",
  },
  progressActive: {
    backgroundColor: "#0a66c2",
    color: "white",
  },
  progressLine: {
    width: "60px",
    height: "2px",
    backgroundColor: "#e0e0e0",
    margin: "0 10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
  },
  stepContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  sectionContainer: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "16px",
  },
  subsectionTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "16px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
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
    padding: "12px 16px",
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
    padding: "12px 16px",
    fontSize: "15px",
    border: "2px solid #d0d0d0",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
    minHeight: "80px",
    resize: "vertical",
    fontFamily: "'Segoe UI', system-ui, Arial, sans-serif",
    backgroundColor: "white",
  },
  itemCard: {
    padding: "12px 16px",
    backgroundColor: "white",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    marginBottom: "8px",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  itemDetail: {
    fontSize: "14px",
    color: "#666",
  },
  removeButton: {
    color: "#ff4444",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    padding: "4px 8px",
  },
  wizardContainer: {
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    border: "2px solid #0a66c2",
    marginTop: "16px",
  },
  wizardTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0a66c2",
    marginBottom: "16px",
  },
  wizardActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  addButton: {
    backgroundColor: "transparent",
    color: "#0a66c2",
    border: "2px solid #0a66c2",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  primaryButton: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    color: "#0a66c2",
    border: "2px solid #0a66c2",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  stepActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
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
  message: {
    marginTop: "20px",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "center",
    border: "1px solid",
  },
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