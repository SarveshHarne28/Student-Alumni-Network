import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Index from "./components/Index"; // Your landing page
import StudentRegister from "./components/StudentRegister";
import StudentLogin from "./components/StudentLogin";
import Profile from "./components/Profile";
import AlumniRegister from "./components/AlumniRegister";
import AlumniLogin from "./components/AlumniLogin";
import AlumniProfile from "./components/AlumniProfile";
import CreateOpportunity from "./components/CreateOpportunity";
import MyOpportunities from "./components/MyOpportunities";
import EditOpportunity from "./components/EditOpportunity";
import AdminPanel from "./components/AdminPanel";
import ViewApplicants from "./components/ViewApplicants";
import OpportunitiesList from "./components/OpportunitiesList";
import MyApplications from "./components/MyApplications";

// Connections & Messages
import ConnectionList from "./components/Connections/ConnectionList";
import SendRequest from "./components/Connections/SendRequest";
import ChatBox from "./components/Messages/ChatBox";

// Profile Components
import UserSearch from './components/UserSearch';
import EditStudentProfile from "./components/EditStudentProfile";
import EditAlumniProfile from "./components/EditAlumniProfile";
import UserProfileView from "./components/UserProfileView";

// Main App Component
function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [role, setRole] = useState(null);
  const [viewingOpportunity, setViewingOpportunity] = useState(null);
  const [activeSection, setActiveSection] = useState("home");
  const [editingProfile, setEditingProfile] = useState(false);
  const [chatWith, setChatWith] = useState(null);
  const [initialRedirectDone, setInitialRedirectDone] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      setRole(null);
      setInitialRedirectDone(false);
      return;
    }
    
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const newRole = payload.role;
      setRole(newRole);
      
      // Only redirect on initial login, not on every route change
      if (!initialRedirectDone && (location.pathname === "/" || location.pathname === "/dashboard")) {
        if (newRole === 'student') {
          navigate("/opportunities");
          setActiveSection("opportunities");
        } else if (newRole === 'alumni') {
          navigate("/manage-opportunities");
          setActiveSection("manage-opportunities");
        } else if (newRole === 'admin') {
          navigate("/admin");
          setActiveSection("admin");
        }
        setInitialRedirectDone(true);
      }
    } catch (err) {
      setRole(null);
      setInitialRedirectDone(false);
    }
  }, [token, navigate, initialRedirectDone, location.pathname]);

  const handleSetToken = (tkn) => {
    if (tkn) {
      localStorage.setItem("token", tkn);
      setToken(tkn);
      setInitialRedirectDone(false); // Reset redirect flag on new login
    } else {
      localStorage.removeItem("token");
      setToken(null);
      setRole(null);
      setInitialRedirectDone(false);
    }
  };

  const handleLogout = () => {
    handleSetToken(null);
    setViewingOpportunity(null);
    setChatWith(null);
    setActiveSection("home");
    setEditingProfile(false);
    navigate("/");
  };

  const handleProfileSave = () => {
    setEditingProfile(false);
  };

  // Static Navbar Component - Only shows when logged in
  const StaticNavbar = () => {
    if (!token) return null;
    
    return (
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <h2 style={styles.logo} onClick={() => {
            const defaultRoute = getDefaultRoute();
            navigate(defaultRoute);
            setActiveSection(defaultRoute.replace("/", ""));
          }}>
            JNEC <span style={styles.logoSubtext}>Alumni Network</span>
          </h2>
          
          <div style={styles.navLinks}>
            {/* Student-specific navigation */}
            {role === "student" && (
              <>
                <button 
                  onClick={() => {
                    setActiveSection("opportunities");
                    navigate("/opportunities");
                  }}
                  style={activeSection === "opportunities" ? styles.activeNavLink : styles.navLink}
                >
                  💼 Opportunities
                </button>
                <button 
                  onClick={() => {
                    setActiveSection("applications");
                    navigate("/my-applications");
                  }}
                  style={activeSection === "applications" ? styles.activeNavLink : styles.navLink}
                >
                  📝 My Applications
                </button>
              </>
            )}

            {/* Alumni-specific navigation */}
            {role === "alumni" && (
              <button 
                onClick={() => {
                  setActiveSection("manage-opportunities");
                  navigate("/manage-opportunities");
                }}
                style={activeSection === "manage-opportunities" ? styles.activeNavLink : styles.navLink}
              >
                💼 Manage Opportunities
              </button>
            )}

            {/* Admin-specific navigation - Only show Admin Panel */}
            {role === "admin" && (
              <button 
                onClick={() => {
                  setActiveSection("admin");
                  navigate("/admin");
                }}
                style={activeSection === "admin" ? styles.activeNavLink : styles.navLink}
              >
                ⚙️ Admin Panel
              </button>
            )}

            {/* Common navigation for students and alumni (not admin) */}
            {(role === "student" || role === "alumni") && (
              <>
                <button 
                  onClick={() => {
                    setActiveSection("network");
                    setEditingProfile(false);
                    navigate("/search-users");
                  }}
                  style={activeSection === "network" ? styles.activeNavLink : styles.navLink}
                >
                  🔍 Network
                </button>
                
                <button 
                  onClick={() => {
                    setActiveSection("connections");
                    setEditingProfile(false);
                    navigate("/connections");
                  }}
                  style={activeSection === "connections" ? styles.activeNavLink : styles.navLink}
                >
                  👥 Connections
                </button>

                <button 
                  onClick={() => {
                    setActiveSection("profile");
                    setEditingProfile(false);
                    navigate("/my-profile");
                  }}
                  style={activeSection === "profile" ? styles.activeNavLink : styles.navLink}
                >
                  👤 My Profile
                </button>
              </>
            )}

            {/* Logout Button */}
            <button onClick={handleLogout} style={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  };

  // Static Footer Component - Only shows when logged in
  const StaticFooter = () => {
    if (!token) return null;
    
    return (
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
            <button 
              onClick={() => navigate("/opportunities")} 
              style={styles.footerLink}
            >
              Opportunities
            </button>
            <button 
              onClick={() => navigate("/search-users")} 
              style={styles.footerLink}
            >
              Network
            </button>
            <button 
              onClick={() => navigate("/my-profile")} 
              style={styles.footerLink}
            >
              Profile
            </button>
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
    );
  };

  // Render profile section with editing capability
  const renderProfileSection = () => {
    if (!token) {
      return (
        <div style={styles.restrictedAccess}>
          <p>⚠️ Please login to view and edit your profile.</p>
          <button onClick={() => navigate("/")} style={styles.backHomeButton}>
            Go to Home
          </button>
        </div>
      );
    }

    if (editingProfile) {
      return role === 'student' ? (
        <EditStudentProfile 
          token={token}
          onSave={handleProfileSave}
          onCancel={() => setEditingProfile(false)}
        />
      ) : role === 'alumni' ? (
        <EditAlumniProfile 
          token={token}
          onSave={handleProfileSave}
          onCancel={() => setEditingProfile(false)}
        />
      ) : (
        <div style={styles.restrictedAccess}>
          <p>Admin profiles cannot be edited here.</p>
        </div>
      );
    }

    // Viewing mode - No header, just the profile component
    return (
      <div>
        {role === 'student' && <Profile token={token} />}
        {role === 'alumni' && <AlumniProfile token={token} />}
        {role === 'admin' && (
          <div style={styles.adminProfile}>
            <p>Admin profile management coming soon...</p>
          </div>
        )}
      </div>
    );
  };

  // Get the default route based on role
  const getDefaultRoute = () => {
    if (role === 'student') return "/opportunities";
    if (role === 'alumni') return "/manage-opportunities";
    if (role === 'admin') return "/admin";
    return "/";
  };

  // Wrapper for pages that need header/navigation
  const PageWrapper = ({ children }) => (
    <div style={styles.appWrapper}>
      <StaticNavbar />
      <div style={styles.mainContentWrapper}>
        <main style={styles.mainContent}>
          {children}
        </main>
      </div>
      <StaticFooter />
    </div>
  );

  return (
    <Routes>
      {/* Landing Page - No static navbar/footer */}
      <Route path="/" element={<Index />} />
      
      {/* Public Authentication Routes - NO PageWrapper, just the component */}
      <Route 
        path="/student-login" 
        element={<StudentLogin setToken={handleSetToken} />} 
      />
      
      <Route 
        path="/student-register" 
        element={<StudentRegister />} 
      />
      
      <Route 
        path="/alumni-login" 
        element={<AlumniLogin setToken={handleSetToken} />} 
      />
      
      <Route 
        path="/alumni-register" 
        element={<AlumniRegister />} 
      />
      
      {/* Student Routes */}
      <Route 
        path="/opportunities" 
        element={
          <PageWrapper>
            {token && role === 'student' ? (
              <OpportunitiesList />
            ) : (
              <div style={styles.restrictedAccess}>
                <p>⚠️ Please login as a student to view opportunities.</p>
                <button onClick={() => navigate("/")} style={styles.backHomeButton}>
                  Go to Home
                </button>
              </div>
            )}
          </PageWrapper>
        } 
      />
      
      <Route 
        path="/my-applications" 
        element={
          <PageWrapper>
            {token && role === 'student' ? (
              <MyApplications token={token} />
            ) : (
              <div style={styles.restrictedAccess}>
                <p>⚠️ Please login as a student to view your applications.</p>
                <button onClick={() => navigate("/")} style={styles.backHomeButton}>
                  Go to Home
                </button>
              </div>
            )}
          </PageWrapper>
        } 
      />
      
      {/* Alumni Routes */}
      <Route 
        path="/manage-opportunities" 
        element={
          <PageWrapper>
            {token && role === 'alumni' ? (
              <div>
                <div style={styles.manageOpportunitiesHeader}>
                  <button 
                    onClick={() => navigate("/create-opportunity")}
                    style={styles.createOpportunityButton}
                  >
                    ➕ Create Opportunity
                  </button>
                </div>
                <MyOpportunities
                  token={token}
                  onEdit={(opp) => navigate(`/edit-opportunity/${opp.opportunity_id}`)}
                  onViewApplicants={(opp) => navigate(`/view-applicants/${opp.opportunity_id}`)}
                />
              </div>
            ) : (
              <div style={styles.restrictedAccess}>
                <p>⚠️ Please login as a verified alumni to manage opportunities.</p>
                <button onClick={() => navigate("/")} style={styles.backHomeButton}>
                  Go to Home
                </button>
              </div>
            )}
          </PageWrapper>
        } 
      />

      {/* Create Opportunity Route */}
      <Route 
        path="/create-opportunity" 
        element={
          <PageWrapper>
            {token && role === 'alumni' ? (
              <CreateOpportunity 
                token={token} 
                onCreated={() => navigate("/manage-opportunities")} 
              />
            ) : (
              <div style={styles.restrictedAccess}>
                <p>⚠️ Please login as a verified alumni to create opportunities.</p>
                <button onClick={() => navigate("/")} style={styles.backHomeButton}>
                  Go to Home
                </button>
              </div>
            )}
          </PageWrapper>
        } 
      />

      {/* Edit Opportunity Route */}
      <Route 
        path="/edit-opportunity/:opportunityId" 
        element={
          <PageWrapper>
            {token && role === 'alumni' ? (
              <EditOpportunity
                token={token}
                onClose={() => navigate("/manage-opportunities")}
              />
            ) : (
              <div style={styles.restrictedAccess}>
                <p>⚠️ Please login as a verified alumni to edit opportunities.</p>
                <button onClick={() => navigate("/")} style={styles.backHomeButton}>
                  Go to Home
                </button>
              </div>
            )}
          </PageWrapper>
        } 
      />

      {/* View Applicants Route */}
      <Route 
        path="/view-applicants/:opportunityId" 
        element={
          <PageWrapper>
            {token && role === 'alumni' ? (
              <ViewApplicants
                token={token}
                onClose={() => navigate("/manage-opportunities")}
              />
            ) : (
              <div style={styles.restrictedAccess}>
                <p>⚠️ Please login as a verified alumni to view applicants.</p>
                <button onClick={() => navigate("/")} style={styles.backHomeButton}>
                  Go to Home
                </button>
              </div>
            )}
          </PageWrapper>
        } 
      />
      
      {/* Admin Route - Only show Admin Panel */}
      <Route 
        path="/admin" 
        element={
          <PageWrapper>
            {token && role === 'admin' ? (
              <AdminPanel token={token} />
            ) : (
              <div style={styles.restrictedAccess}>
                <p>⚠️ Please login as admin to access this panel.</p>
                <button onClick={() => navigate("/")} style={styles.backHomeButton}>
                  Go to Home
                </button>
              </div>
            )}
          </PageWrapper>
        } 
      />
      
      {/* Search Users Route - Not available for admin */}
      <Route 
        path="/search-users" 
        element={
          <PageWrapper>
            {token && role !== 'admin' ? (
              <UserSearch onStartChat={setChatWith} />
            ) : (
              <div style={styles.restrictedAccess}>
                <p>⚠️ This feature is not available for admin users.</p>
                <button onClick={() => navigate("/")} style={styles.backHomeButton}>
                  Go to Home
                </button>
              </div>
            )}
          </PageWrapper>
        } 
      />
      
      {/* Connections Route - Not available for admin */}
      <Route 
        path="/connections" 
        element={
          <PageWrapper>
            {token && role !== 'admin' ? (
              <ConnectionList onStartChat={setChatWith} />
            ) : (
              <div style={styles.restrictedAccess}>
                <p>⚠️ This feature is not available for admin users.</p>
                <button onClick={() => navigate("/")} style={styles.backHomeButton}>
                  Go to Home
                </button>
              </div>
            )}
          </PageWrapper>
        } 
      />
      
      {/* Messages Route - Not available for admin */}
      <Route 
        path="/messages" 
        element={
          <PageWrapper>
            {token && role !== 'admin' ? (
              <div>
                {chatWith ? (
                  <div>
                    <button 
                      onClick={() => setChatWith(null)}
                      style={styles.backButton}
                    >
                      ← Back to Messages
                    </button>
                    <ChatBox withUserId={chatWith} />
                  </div>
                ) : (
                  <div style={styles.emptyState}>
                    <p>Select a connection to start chatting, or use the Network tab to find users.</p>
                    <button onClick={() => navigate("/connections")} style={styles.backHomeButton}>
                      View Connections
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={styles.restrictedAccess}>
                <p>⚠️ This feature is not available for admin users.</p>
                <button onClick={() => navigate("/")} style={styles.backHomeButton}>
                  Go to Home
                </button>
              </div>
            )}
          </PageWrapper>
        } 
      />
      
      {/* My Profile Route - Not available for admin */}
      <Route 
        path="/my-profile" 
        element={
          <PageWrapper>
            {token && role !== 'admin' ? (
              renderProfileSection()
            ) : (
              <div style={styles.restrictedAccess}>
                <p>⚠️ This feature is not available for admin users.</p>
                <button onClick={() => navigate("/")} style={styles.backHomeButton}>
                  Go to Home
                </button>
              </div>
            )}
          </PageWrapper>
        } 
      />
      
      {/* User Profile View Route - Not available for admin */}
      <Route 
        path="/profile/:userId" 
        element={
          <PageWrapper>
            {token && role !== 'admin' ? (
              <UserProfileView />
            ) : (
              <div style={styles.restrictedAccess}>
                <p>⚠️ This feature is not available for admin users.</p>
                <button onClick={() => navigate("/")} style={styles.backHomeButton}>
                  Go to Home
                </button>
              </div>
            )}
          </PageWrapper>
        } 
      />

      {/* Catch-all route for /dashboard - redirect to appropriate page */}
      <Route 
        path="/dashboard" 
        element={
          <PageWrapper>
            <div style={styles.redirectMessage}>
              <p>Redirecting to your dashboard...</p>
            </div>
          </PageWrapper>
        } 
      />
    </Routes>
  );
}

// Styles
const styles = {
  appWrapper: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    display: "flex",
    flexDirection: "column",
  },
  mainContentWrapper: {
    flex: 1,
    width: "100%",
  },
  mainContent: {
    width: "100%",
    minHeight: "calc(100vh - 140px)", // Adjust based on navbar and footer height
    padding: "0",
  },
  
  // Navbar Styles (Static - similar to Index.jsx)
  navbar: {
    backgroundColor: "white",
    borderBottom: "1px solid #e0e0e0",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    width: "100%",
  },
  navContainer: {
    width: "100%",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    boxSizing: "border-box",
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
    gap: "16px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  navLink: {
    background: "none",
    border: "1px solid #d0d0d0",
    color: "#333",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.3s ease",
    textDecoration: "none",
  },
  activeNavLink: {
    background: "#0a66c2",
    border: "1px solid #0a66c2",
    color: "white",
    padding: "8px 16px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    textDecoration: "none",
  },
  logoutButton: {
    background: "#dc3545",
    border: "none",
    color: "white",
    padding: "8px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    marginLeft: "8px",
  },
  
  // Footer Styles (Static - similar to Index.jsx)
  footer: {
    backgroundColor: "#1a1a1a",
    color: "white",
    padding: "40px 20px 20px",
    width: "100%",
    marginTop: "auto",
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
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
    padding: "0",
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
  
  // Existing styles
  manageOpportunitiesHeader: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
    padding: "20px",
  },
  createOpportunityButton: {
    padding: "12px 24px",
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  backButton: {
    padding: "8px 16px",
    border: "1px solid #ccc",
    backgroundColor: "transparent",
    color: "#666",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
    marginBottom: "15px",
  },
  adminProfile: {
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  restrictedAccess: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    margin: "20px",
  },
  backHomeButton: {
    marginTop: "20px",
    padding: "12px 24px",
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    margin: "20px",
  },
  redirectMessage: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    margin: "20px",
  },
};

export default App;