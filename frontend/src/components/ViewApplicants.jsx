import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AcceptedStudentsList from './AcceptedStudentsList';

export default function ViewApplicants({ token, onClose }) {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [showAcceptedStudents, setShowAcceptedStudents] = useState(false);

  const t = token || localStorage.getItem("token");

  const fetchApplicants = async () => {
    setError("");
    setLoading(true);
    if (!t) {
      setError("Login required");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:3000/api/applications/opportunity/${opportunityId}`,
        { headers: { Authorization: `Bearer ${t}` } }
      );
      setApplicants(res.data || []);
    } catch (err) {
      console.error("Fetch applicants error:", err);
      setError(err.response?.data?.error || "Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!opportunityId) {
      setError("No opportunity selected");
      setLoading(false);
      return;
    }
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunityId]);

  const updateStatus = async (applicationId, newStatus) => {
    if (!t) return setError("Login required");
    if (!["accepted", "rejected", "pending"].includes(newStatus)) return;

    try {
      setUpdatingId(applicationId);
      await axios.put(
        `http://localhost:3000/api/applications/${applicationId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${t}` } }
      );
      setApplicants((prev) =>
        prev.map((a) =>
          a.application_id === applicationId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error("Update status error:", err);
      setError(err.response?.data?.error || "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else navigate("/manage-opportunities");
  };

  // Count accepted students
  const acceptedCount = applicants.filter(a => a.status === 'accepted').length;

  // small reusable styles
  const styles = {
    container: {
      border: "1px solid #ddd",
      borderRadius: 12,
      padding: 20,
      background: "#fff",
      maxWidth: 800,
      margin: "20px auto",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      fontFamily: "system-ui, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      flexWrap: "wrap",
      gap: "10px",
    },
    applicantCard: {
      border: "1px solid #eee",
      borderRadius: 10,
      padding: 16,
      marginBottom: 16,
      background: "#fafafa",
    },
    name: { fontSize: 16, fontWeight: 600, color: "#333" },
    email: { fontSize: 14, color: "#555" },
    meta: { fontSize: 13, color: "#777" },
    resume: { fontSize: 13, color: "#0073b1", textDecoration: "none" },
    statusBadge: (status) => ({
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      textTransform: "capitalize",
      background:
        status === "accepted"
          ? "#d1f7d6"
          : status === "rejected"
          ? "#fcdada"
          : "#f0f0f0",
      color:
        status === "accepted"
          ? "#0a8f33"
          : status === "rejected"
          ? "#c62828"
          : "#555",
    }),
    button: {
      padding: "6px 14px",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontSize: 13,
      marginRight: 8,
      fontWeight: 500,
    },
    acceptBtn: { background: "#0a66c2", color: "white" },
    rejectBtn: { background: "#e63946", color: "white" },
    pendingBtn: { background: "#f1c40f", color: "black" },
    viewAcceptedBtn: {
      background: "#28a745",
      color: "white",
      padding: "8px 16px",
      borderRadius: 6,
      border: "none",
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 500,
    },
    actionButtons: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 12,
      flexWrap: "wrap",
      gap: "10px",
    },
    acceptedInfo: {
      fontSize: 14,
      color: "#28a745",
      fontWeight: 500,
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading applicants...</p>;
  if (error)
    return (
      <div style={styles.container}>
        <p style={{ color: "red" }}>{error}</p>
        <button style={styles.button} onClick={fetchApplicants}>
          Retry
        </button>
        <button style={{ ...styles.button, background: "#ccc" }} onClick={handleClose}>
          Close
        </button>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={{ margin: 0 }}>Applicants for Opportunity #{opportunityId}</h3>
        {acceptedCount > 0 && (
          <button
            onClick={() => setShowAcceptedStudents(!showAcceptedStudents)}
            style={styles.viewAcceptedBtn}
          >
            {showAcceptedStudents ? "📋 Hide" : "✅ View"} Accepted Students ({acceptedCount})
          </button>
        )}
      </div>

      {/* Accepted Students Section */}
      {showAcceptedStudents && (
        <div style={{ marginBottom: 30 }}>
          <AcceptedStudentsList 
            opportunityId={opportunityId} 
            token={t} 
          />
        </div>
      )}

      {/* All Applicants List */}
      {!showAcceptedStudents && (
        <>
          {applicants.length === 0 ? (
            <p style={{ color: "#555" }}>No applications yet.</p>
          ) : (
            applicants.map((a) => (
              <div key={a.application_id} style={styles.applicantCard}>
                <div style={styles.name}>{a.name}</div>
                <div style={styles.email}>{a.email}</div>
                <div style={{ margin: "6px 0" }}>
                  <span style={styles.meta}>
                    {a.graduation_year ? `Grad: ${a.graduation_year}` : ""}
                    {a.major ? ` • ${a.major}` : ""}
                    {a.cgpa ? ` • CGPA: ${a.cgpa}` : ""}
                  </span>
                </div>
                {a.resume_url ? (
                  <a href={a.resume_url} target="_blank" rel="noopener noreferrer" style={styles.resume}>
                    View Resume
                  </a>
                ) : (
                  <span style={styles.meta}>No resume provided</span>
                )}
                <div style={{ marginTop: 10 }}>
                  <span style={styles.statusBadge(a.status)}> {a.status} </span>
                </div>
                <div style={{ marginTop: 12 }}>
                  <button
                    style={{ ...styles.button, ...styles.acceptBtn }}
                    onClick={() => updateStatus(a.application_id, "accepted")}
                    disabled={updatingId === a.application_id || a.status === "accepted"}
                  >
                    Accept
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.rejectBtn }}
                    onClick={() => updateStatus(a.application_id, "rejected")}
                    disabled={updatingId === a.application_id || a.status === "rejected"}
                  >
                    Reject
                  </button>
                  <button
                    style={{ ...styles.button, ...styles.pendingBtn }}
                    onClick={() => updateStatus(a.application_id, "pending")}
                    disabled={updatingId === a.application_id || a.status === "pending"}
                  >
                    Set Pending
                  </button>
                </div>
              </div>
            ))
          )}
        </>
      )}

      {/* Action Buttons */}
      <div style={styles.actionButtons}>
        <div>
          {acceptedCount > 0 && !showAcceptedStudents && (
            <span style={styles.acceptedInfo}>
              ✅ {acceptedCount} student(s) accepted
            </span>
          )}
        </div>
        
        <div>
          <button style={{ ...styles.button, background: "#eee" }} onClick={fetchApplicants}>
            Refresh
          </button>
          <button style={{ ...styles.button, background: "#ccc" }} onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}