import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [filterRole, setFilterRole] = useState("all");
  const navigate = useNavigate();

  // Get current user ID on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.user_id);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  // Fetch all users by default on component mount
  useEffect(() => {
    if (currentUserId) {
      fetchAllUsers();
    }
  }, [currentUserId]);

  const filterUsers = (users) => {
    let filtered = users.filter(user => 
      user.role !== "admin" && 
      user.user_id !== currentUserId
    );
    
    if (filterRole !== "all") {
      filtered = filtered.filter(user => user.role === filterRole);
    }
    
    return filtered;
  };

  const fetchAllUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/users`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const filteredUsers = filterUsers(response.data);
      setSearchResults(filteredUsers);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError(err.response?.data?.error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      fetchAllUsers();
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3000/api/users/search?q=${encodeURIComponent(searchTerm)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const filteredResults = filterUsers(response.data);
      setSearchResults(filteredResults);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.response?.data?.error || "Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleFilterChange = (role) => {
    setFilterRole(role);
  };

  useEffect(() => {
    if (currentUserId) {
      fetchAllUsers();
    }
  }, [filterRole]);

  const getRoleColor = (role) => {
    return role === "alumni" ? "#0a66c2" : "#16a34a";
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Header Section */}
      <div style={styles.headerSection}>
        <div style={styles.headerContent}>
          <div style={styles.headerIcon}>👥</div>
          <h1 style={styles.pageTitle}>Discover Your Network</h1>
          <p style={styles.pageSubtitle}>
            Connect with students and alumni from JNEC community
          </p>
        </div>
      </div>

      <div style={styles.container}>
        {/* Search Section */}
        <div style={styles.searchSection}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.searchInputWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <button 
              type="submit" 
              style={styles.searchButton} 
              disabled={loading}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = "#004182")}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = "#0a66c2")}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* Filter Tabs */}
          <div style={styles.filterTabs}>
            <button
              onClick={() => handleFilterChange("all")}
              style={{
                ...styles.filterTab,
                ...(filterRole === "all" ? styles.filterTabActive : {})
              }}
              onMouseEnter={(e) => filterRole !== "all" && (e.currentTarget.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => filterRole !== "all" && (e.currentTarget.style.backgroundColor = "transparent")}
            >
              👥 All Users
            </button>
            <button
              onClick={() => handleFilterChange("student")}
              style={{
                ...styles.filterTab,
                ...(filterRole === "student" ? styles.filterTabActive : {})
              }}
              onMouseEnter={(e) => filterRole !== "student" && (e.currentTarget.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => filterRole !== "student" && (e.currentTarget.style.backgroundColor = "transparent")}
            >
              👨‍🎓 Students
            </button>
            <button
              onClick={() => handleFilterChange("alumni")}
              style={{
                ...styles.filterTab,
                ...(filterRole === "alumni" ? styles.filterTabActive : {})
              }}
              onMouseEnter={(e) => filterRole !== "alumni" && (e.currentTarget.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => filterRole !== "alumni" && (e.currentTarget.style.backgroundColor = "transparent")}
            >
              💼 Alumni
            </button>
          </div>
        </div>

        {error && (
          <div style={styles.errorBanner}>
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Results Section */}
        <div style={styles.resultsSection}>
          {loading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Loading users...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div style={styles.resultsHeader}>
                <h3 style={styles.resultsTitle}>
                  {searchTerm ? `Search Results` : `All Users`}
                </h3>
                <span style={styles.resultsCount}>
                  {searchResults.length} {searchResults.length === 1 ? 'user' : 'users'} found
                </span>
              </div>
              
              <div style={styles.userGrid}>
                {searchResults.map((user) => (
                  <div 
                    key={user.user_id} 
                    style={styles.userCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                    }}
                  >
                    <div style={styles.cardHeader}>
                      <div style={{
                        ...styles.avatar,
                        backgroundColor: getRoleColor(user.role) + "20",
                        color: getRoleColor(user.role)
                      }}>
                        {getInitials(user.name)}
                      </div>
                      <div style={{
                        ...styles.roleBadge,
                        backgroundColor: getRoleColor(user.role) + "15",
                        color: getRoleColor(user.role)
                      }}>
                        <span>{user.role === "alumni" ? "💼" : "🎓"}</span>
                        <span style={styles.roleBadgeText}>
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div style={styles.cardBody}>
                      <h4 style={styles.userName}>{user.name}</h4>
                      
                      <div style={styles.userDetails}>
                        <div style={styles.detailItem}>
                          <span style={styles.detailIcon}>✉️</span>
                          <span style={styles.detailText}>{user.email}</span>
                        </div>
                        
                        {user.company_name && (
                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>🏢</span>
                            <span style={styles.detailText}>{user.company_name}</span>
                          </div>
                        )}
                        
                        {user.major && (
                          <div style={styles.detailItem}>
                            <span style={styles.detailIcon}>📚</span>
                            <span style={styles.detailText}>{user.major}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={styles.cardFooter}>
                      <button
                        onClick={() => handleViewProfile(user.user_id)}
                        style={styles.viewProfileButton}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#004182";
                          e.currentTarget.style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#0a66c2";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🔍</div>
              <h3 style={styles.emptyTitle}>
                {searchTerm ? "No users found" : "No users available"}
              </h3>
              <p style={styles.emptyText}>
                {searchTerm 
                  ? "Try adjusting your search terms or filters"
                  : "There are no users to display at the moment"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    fontFamily: "'Segoe UI', system-ui, Arial, sans-serif",
  },
  headerSection: {
    background: "linear-gradient(135deg, #0a66c2 0%, #004182 100%)",
    color: "white",
    padding: "60px 20px",
    marginBottom: "40px",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    textAlign: "center",
  },
  headerIcon: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  pageTitle: {
    fontSize: "42px",
    fontWeight: "700",
    marginBottom: "12px",
    lineHeight: "1.2",
  },
  pageSubtitle: {
    fontSize: "18px",
    opacity: 0.95,
    fontWeight: "400",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px 60px",
  },
  searchSection: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  searchForm: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  searchInputWrapper: {
    flex: 1,
    minWidth: "300px",
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    fontSize: "20px",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "14px 16px 14px 48px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "16px",
    fontFamily: "'Segoe UI', system-ui, Arial, sans-serif",
    transition: "all 0.3s ease",
    outline: "none",
  },
  searchButton: {
    padding: "14px 32px",
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    whiteSpace: "nowrap",
  },
  filterTabs: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  filterTab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "transparent",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "500",
    color: "#333",
    transition: "all 0.3s ease",
  },
  filterTabActive: {
    backgroundColor: "#0a66c2",
    color: "white",
    borderColor: "#0a66c2",
  },
  errorBanner: {
    backgroundColor: "#fee",
    color: "#c33",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center",
    border: "1px solid #fcc",
  },
  resultsSection: {
    minHeight: "400px",
  },
  resultsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "12px",
  },
  resultsTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#333",
    margin: 0,
  },
  resultsCount: {
    fontSize: "16px",
    color: "#666",
    fontWeight: "500",
    backgroundColor: "#f0f0f0",
    padding: "8px 16px",
    borderRadius: "20px",
  },
  userGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "24px",
  },
  userCard: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
    border: "1px solid #e0e0e0",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  avatar: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
  },
  roleBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },
  roleBadgeText: {
    lineHeight: "1",
  },
  cardBody: {
    marginBottom: "20px",
  },
  userName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "16px",
    margin: 0,
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  detailItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  detailIcon: {
    fontSize: "16px",
  },
  detailText: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.4",
  },
  cardFooter: {
    borderTop: "1px solid #f0f0f0",
    paddingTop: "16px",
  },
  viewProfileButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 20px",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #f0f0f0",
    borderTop: "4px solid #0a66c2",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "20px",
    color: "#666",
    fontSize: "16px",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
  },
  emptyIcon: {
    fontSize: "64px",
    marginBottom: "20px",
  },
  emptyTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "12px",
  },
  emptyText: {
    fontSize: "16px",
    color: "#666",
    maxWidth: "400px",
    margin: "0 auto",
  },
};

// Add keyframe animation for spinner in your global CSS or index.css
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus {
    border-color: #0a66c2 !important;
  }
`;
document.head.appendChild(style);

export default UserSearch;