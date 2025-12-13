import React, { useState, useEffect } from "react";
import axios from "axios";

const AcceptedStudentsList = ({ opportunityId, token }) => {
  const [acceptedStudents, setAcceptedStudents] = useState([]);
  const [opportunityTitle, setOpportunityTitle] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailDetails, setEmailDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchAcceptedStudents = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    
    try {
      const t = token || localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:3000/api/applications/opportunity/${opportunityId}/accepted`,
        { headers: { Authorization: `Bearer ${t}` } }
      );
      
      setAcceptedStudents(res.data.students || []);
      setOpportunityTitle(res.data.opportunity_title || "");
    } catch (err) {
      console.error("Error fetching accepted students:", err);
      setError("Backend API not implemented yet. Please add the routes to application.controller.js");
    } finally {
      setLoading(false);
    }
  };

  const sendBulkEmail = async () => {
    if (!emailDetails.trim()) {
      setMessage("Please enter email details");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");
    
    try {
      const t = token || localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:3000/api/applications/opportunity/${opportunityId}/notify-accepted`,
        { 
          email_content: emailDetails,
          student_ids: acceptedStudents.map(s => s.student_id)
        },
        { headers: { Authorization: `Bearer ${t}` } }
      );
      
      setMessage(res.data.message || "Email sent successfully!");
      setShowEmailForm(false);
      setEmailDetails("");
    } catch (err) {
      console.error("Error sending email:", err);
      setError(err.response?.data?.error || "Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (opportunityId) {
      fetchAcceptedStudents();
    }
  }, [opportunityId]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3>✅ Accepted Students</h3>
        {acceptedStudents.length > 0 && (
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            style={styles.emailButton}
          >
            📧 Notify All Accepted Students
          </button>
        )}
      </div>

      {error && (
        <div style={styles.error}>
          <p><strong>Backend Setup Required:</strong></p>
          <p>{error}</p>
          <ol style={{ textAlign: 'left', margin: '10px 0' }}>
            <li>Add getAcceptedStudents function to application.controller.js</li>
            <li>Add notifyAcceptedStudents function to application.controller.js</li>
            <li>Add the two new routes to application.routes.js</li>
            <li>Restart your backend server</li>
          </ol>
        </div>
      )}

      {message && (
        <p style={styles.successMessage}>{message}</p>
      )}

      {/* Email Form */}
      {showEmailForm && (
        <div style={styles.emailForm}>
          <h4>Compose Email to Accepted Students</h4>
          <textarea
            value={emailDetails}
            onChange={(e) => setEmailDetails(e.target.value)}
            placeholder="Enter interview details, next steps, schedule, etc..."
            style={styles.textarea}
            rows="8"
          />
          <div style={styles.emailActions}>
            <button
              onClick={sendBulkEmail}
              disabled={loading}
              style={styles.sendButton}
            >
              {loading ? "Sending..." : `Send Email to ${acceptedStudents.length} Students`}
            </button>
            <button
              onClick={() => setShowEmailForm(false)}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Students List */}
      <div style={styles.studentsList}>
        {acceptedStudents.length === 0 && !error ? (
          <p style={styles.noStudents}>No accepted students yet.</p>
        ) : (
          acceptedStudents.map((student) => (
            <div key={student.application_id} style={styles.studentCard}>
              <div style={styles.studentInfo}>
                <strong>{student.name}</strong>
                <span>{student.email}</span>
                <small>
                  {student.major && `Major: ${student.major}`}
                  {student.cgpa && ` • CGPA: ${student.cgpa}`}
                </small>
              </div>
              <div style={styles.applicationInfo}>
                <span style={styles.acceptedBadge}>Accepted</span>
                <small>Applied: {new Date(student.applied_at).toLocaleDateString()}</small>
              </div>
            </div>
          ))
        )}
      </div>

      <button onClick={fetchAcceptedStudents} style={styles.refreshButton}>
        Refresh List
      </button>
    </div>
  );
};

const styles = {
  container: {
    border: "1px solid #e1e4e8",
    borderRadius: "12px",
    padding: "20px",
    margin: "20px 0",
    backgroundColor: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  emailButton: {
    backgroundColor: "#0a66c2",
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "10px 16px",
    cursor: "pointer",
  },
  emailForm: {
    border: "1px solid #e1e4e8",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "20px",
    backgroundColor: "#fafbfc",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d1d5da",
    borderRadius: "6px",
    marginBottom: "12px",
    resize: "vertical",
  },
  emailActions: {
    display: "flex",
    gap: "10px",
  },
  sendButton: {
    backgroundColor: "#2ea44f",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
  },
  studentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  studentCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    border: "1px solid #e1e4e8",
    borderRadius: "8px",
    backgroundColor: "#f8f9fa",
  },
  acceptedBadge: {
    backgroundColor: "#d1f7d6",
    color: "#0a8f33",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  noStudents: {
    textAlign: "center",
    color: "#6c757d",
    fontStyle: "italic",
  },
  refreshButton: {
    backgroundColor: "#f3f4f6",
    border: "1px solid #d1d5da",
    borderRadius: "6px",
    padding: "8px 16px",
    cursor: "pointer",
    marginTop: "16px",
  },
  error: {
    backgroundColor: "#fef0f0",
    border: "1px solid #f56565",
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "16px",
    color: "#c53030",
    textAlign: 'center',
  },
  successMessage: {
    backgroundColor: "#f0f9f0",
    border: "1px solid #48bb78",
    borderRadius: "6px",
    padding: "12px",
    marginBottom: "16px",
    color: "#2d7745",
  },
};

export default AcceptedStudentsList;