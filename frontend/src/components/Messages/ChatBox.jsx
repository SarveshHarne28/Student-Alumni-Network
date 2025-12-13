import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000/api";

const MessagingApp = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchCurrentUser();
    fetchContacts();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages();
      const interval = setInterval(() => {
        fetchMessages();
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedContact]);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data);
    } catch (err) {
      console.error("❌ fetchCurrentUser error:", err);
    }
  };

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (Array.isArray(res.data)) {
        const contactsWithLastMessage = res.data.map(contact => ({
          ...contact,
          lastMessage: "Start a conversation",
          lastMessageTime: null,
          unreadCount: 0
        }));
        setContacts(contactsWithLastMessage);
      }
    } catch (err) {
      console.error("❌ fetchContacts error:", err);
    }
  };

  const fetchMessages = async () => {
    if (!selectedContact) return;
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE}/messages/${selectedContact.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (Array.isArray(res.data)) {
        setMessages(res.data);
      }
    } catch (err) {
      console.error("❌ fetchMessages error:", err);
    }
  };

  const sendMessage = async () => {
    if (!text.trim() || !selectedContact) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE}/messages/send`,
        { to_user_id: selectedContact.user_id, message_text: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      await fetchMessages();
    } catch (err) {
      console.error("❌ sendMessage error:", err);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isCurrentUser = (senderId) => {
    return currentUser && senderId === currentUser.user_id;
  };

  const getDisplayName = (user) => {
    return user.name || user.email?.split('@')[0] || `User ${user.user_id}`;
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  const filteredContacts = contacts.filter(contact => {
    const name = getDisplayName(contact).toLowerCase();
    const email = contact.email?.toLowerCase() || '';
    const query = searchQuery.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  return (
    <div style={styles.pageWrapper}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navContainer}>
          <h2 style={styles.logo}>
            JNEC <span style={styles.logoSubtext}>Messages</span>
          </h2>
          <div style={styles.userInfo}>
            {currentUser && (
              <>
                <div style={styles.avatar}>
                  {getInitials(getDisplayName(currentUser))}
                </div>
                <span style={styles.userName}>{getDisplayName(currentUser)}</span>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Chat Container */}
      <div style={styles.chatContainer}>
        {/* Left Sidebar - Contacts List */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarTitle}>Chats</h3>
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="🔍 Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          <div style={styles.contactsList}>
            {filteredContacts.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>👥</div>
                <p style={styles.emptyText}>No contacts found</p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.user_id}
                  onClick={() => setSelectedContact(contact)}
                  style={{
                    ...styles.contactItem,
                    ...(selectedContact?.user_id === contact.user_id ? styles.contactItemActive : {})
                  }}
                >
                  <div style={styles.contactAvatar}>
                    {getInitials(getDisplayName(contact))}
                  </div>
                  <div style={styles.contactInfo}>
                    <div style={styles.contactHeader}>
                      <h4 style={styles.contactName}>{getDisplayName(contact)}</h4>
                      {contact.lastMessageTime && (
                        <span style={styles.contactTime}>
                          {new Date(contact.lastMessageTime).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    <div style={styles.contactLastMessage}>
                      <p style={styles.lastMessageText}>{contact.lastMessage}</p>
                      {contact.unreadCount > 0 && (
                        <span style={styles.unreadBadge}>{contact.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side - Chat Area */}
        <div style={styles.chatArea}>
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div style={styles.chatHeader}>
                <div style={styles.chatHeaderLeft}>
                  <div style={styles.chatAvatar}>
                    {getInitials(getDisplayName(selectedContact))}
                  </div>
                  <div style={styles.chatHeaderInfo}>
                    <h3 style={styles.chatHeaderName}>{getDisplayName(selectedContact)}</h3>
                    <p style={styles.chatHeaderStatus}>
                      {selectedContact.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div style={styles.messagesContainer}>
                {messages.length === 0 ? (
                  <div style={styles.emptyChat}>
                    <div style={styles.emptyChatIcon}>💬</div>
                    <p style={styles.emptyChatText}>No messages yet</p>
                    <p style={styles.emptyChatSubtext}>Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isYou = isCurrentUser(m.sender_id);
                    
                    return (
                      <div
                        key={m.message_id}
                        style={{
                          ...styles.messageWrapper,
                          justifyContent: isYou ? 'flex-end' : 'flex-start'
                        }}
                      >
                        <div
                          style={{
                            ...styles.messageBubble,
                            ...(isYou ? styles.messageBubbleSent : styles.messageBubbleReceived)
                          }}
                        >
                          <div style={styles.messageText}>{m.message_text}</div>
                          <div style={{
                            ...styles.messageTime,
                            color: isYou ? 'rgba(255,255,255,0.7)' : '#667781'
                          }}>
                            {new Date(m.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {isYou && <span style={styles.checkmark}> ✓</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div style={styles.inputArea}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  style={styles.messageInput}
                />
                <button
                  onClick={sendMessage}
                  disabled={!text.trim() || loading}
                  style={{
                    ...styles.sendButton,
                    ...((!text.trim() || loading) ? styles.sendButtonDisabled : {})
                  }}
                >
                  {loading ? "..." : "➤"}
                </button>
              </div>
            </>
          ) : (
            <div style={styles.welcomeScreen}>
              <div style={styles.welcomeIcon}>💬</div>
              <h2 style={styles.welcomeTitle}>JNEC Messaging</h2>
              <p style={styles.welcomeText}>
                Select a contact to start chatting
              </p>
            </div>
          )}
        </div>
      </div>

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
            © 2025 JNEC - MGM University | All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  pageWrapper: {
    width: "100%",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "'Segoe UI', system-ui, Arial, sans-serif",
    display: "flex",
    flexDirection: "column",
  },

  // Navbar
  navbar: {
    backgroundColor: "#0a66c2",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
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
    color: "white",
    margin: 0,
    fontSize: "24px",
    fontWeight: "700",
  },
  logoSubtext: {
    fontSize: "14px",
    fontWeight: "400",
    opacity: 0.9,
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "white",
    color: "#0a66c2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "14px",
  },
  userName: {
    color: "white",
    fontSize: "16px",
    fontWeight: "500",
  },

  // Main Chat Container
  chatContainer: {
    flex: 1,
    display: "flex",
    maxWidth: "1400px",
    width: "100%",
    margin: "20px auto",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    minHeight: "calc(100vh - 200px)",
  },

  // Sidebar
  sidebar: {
    width: "380px",
    borderRight: "1px solid #e0e0e0",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "white",
  },
  sidebarHeader: {
    padding: "20px",
    borderBottom: "1px solid #e0e0e0",
  },
  sidebarTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0a66c2",
    marginBottom: "16px",
  },
  searchContainer: {
    position: "relative",
  },
  searchInput: {
    width: "100%",
    padding: "10px 16px",
    borderRadius: "20px",
    border: "1px solid #e0e0e0",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
  },
  contactsList: {
    flex: 1,
    overflowY: "auto",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    padding: "16px 20px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    borderBottom: "1px solid #f0f0f0",
  },
  contactItemActive: {
    backgroundColor: "#f0f7ff",
  },
  contactAvatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#0a66c2",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "16px",
    flexShrink: 0,
  },
  contactInfo: {
    flex: 1,
    marginLeft: "16px",
    minWidth: 0,
  },
  contactHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  contactName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  contactTime: {
    fontSize: "12px",
    color: "#667781",
  },
  contactLastMessage: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessageText: {
    fontSize: "14px",
    color: "#667781",
    margin: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  unreadBadge: {
    backgroundColor: "#0a66c2",
    color: "white",
    fontSize: "12px",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "12px",
    minWidth: "20px",
    textAlign: "center",
  },
  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyText: {
    color: "#667781",
    fontSize: "16px",
  },

  // Chat Area
  chatArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f8f9fa",
  },
  chatHeader: {
    backgroundColor: "white",
    padding: "16px 24px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chatHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  chatAvatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    backgroundColor: "#0a66c2",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "16px",
  },
  chatHeaderInfo: {
    display: "flex",
    flexDirection: "column",
  },
  chatHeaderName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111",
    margin: 0,
  },
  chatHeaderStatus: {
    fontSize: "13px",
    color: "#667781",
    margin: "2px 0 0 0",
  },

  // Messages
  messagesContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "20px",
    backgroundImage: "linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%)",
  },
  messageWrapper: {
    display: "flex",
    marginBottom: "12px",
  },
  messageBubble: {
    maxWidth: "65%",
    padding: "8px 12px",
    borderRadius: "8px",
    wordWrap: "break-word",
  },
  messageBubbleSent: {
    backgroundColor: "#0a66c2",
    color: "white",
    borderBottomRightRadius: "2px",
  },
  messageBubbleReceived: {
    backgroundColor: "white",
    color: "#111",
    borderBottomLeftRadius: "2px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  messageText: {
    fontSize: "14px",
    lineHeight: "1.5",
    marginBottom: "4px",
  },
  messageTime: {
    fontSize: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  checkmark: {
    marginLeft: "4px",
  },
  emptyChat: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    padding: "40px",
  },
  emptyChatIcon: {
    fontSize: "64px",
    marginBottom: "16px",
  },
  emptyChatText: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#667781",
    marginBottom: "8px",
  },
  emptyChatSubtext: {
    fontSize: "14px",
    color: "#8696a0",
  },

  // Input Area
  inputArea: {
    backgroundColor: "white",
    padding: "16px 24px",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  messageInput: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "24px",
    border: "1px solid #e0e0e0",
    fontSize: "15px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  sendButton: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",
    fontWeight: "bold",
  },
  sendButtonDisabled: {
    backgroundColor: "#d0d0d0",
    cursor: "not-allowed",
  },

  // Welcome Screen
  welcomeScreen: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "#f8f9fa",
  },
  welcomeIcon: {
    fontSize: "80px",
    marginBottom: "24px",
  },
  welcomeTitle: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0a66c2",
    marginBottom: "12px",
  },
  welcomeText: {
    fontSize: "16px",
    color: "#667781",
    textAlign: "center",
  },

  // Footer (same as original)
  footer: {
    backgroundColor: "#1a1a1a",
    color: "white",
    padding: "60px 20px 20px",
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

export default MessagingApp;