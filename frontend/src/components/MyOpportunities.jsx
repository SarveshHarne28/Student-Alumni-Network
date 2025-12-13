import React, { useEffect, useState } from "react";
import axios from "axios";

export default function MyOpportunities({ token, onEdit, onViewApplicants }) {
  const [opportunities, setOpportunities] = useState([]);
  const [error, setError] = useState("");

  const fetchMy = async () => {
    setError("");
    const t = token || localStorage.getItem("token");
    if (!t) return setError("Login required");

    try {
      const res = await axios.get("http://localhost:3000/api/opportunities/my-postings", {
        headers: { Authorization: `Bearer ${t}` },
      });
      setOpportunities(res.data || []);
    } catch (err) {
      console.error("Fetch my opps error:", err);
      setError(err.response?.data?.error || "Failed to fetch postings");
    }
  };

  useEffect(() => {
    fetchMy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "20px",
        background: "#fff",
        borderRadius: "12px",
        border: "1px solid #ddd",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ marginBottom: "16px", color: "#0a66c2" }}>My Opportunities</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {opportunities.length === 0 && <p style={{ color: "#555" }}>No postings yet</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {opportunities.map((o) => (
          <div
            key={o.opportunity_id}
            style={{
              padding: "16px",
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              background: "#fafafa",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <strong style={{ fontSize: "16px", color: "#333" }}>{o.title}</strong>
            <p style={{ margin: "4px 0", color: "#555" }}>
              {o.type} — {o.status}
            </p>
            <small style={{ color: "#777" }}>{o.company_name || "No company"}</small>
            <p style={{ marginTop: "6px", fontSize: "13px", color: "#444" }}>
              Applications: <b>{o.application_count || 0}</b>
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={() => onEdit && onEdit(o)}
                style={{
                  background: "#f3f2ef",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
              <button
                onClick={() => onViewApplicants && onViewApplicants(o)}
                style={{
                  background: "#0a66c2",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                View Applicants
              </button>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={fetchMy}
        style={{
          marginTop: "20px",
          background: "#0a66c2",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        Refresh
      </button>
    </div>
  );
}
