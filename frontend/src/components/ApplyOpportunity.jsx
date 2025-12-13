import React, { useState } from "react";

const ApplyOpportunity = ({ opportunity, onClose }) => {
  const [resumeUrl, setResumeUrl] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Login required");

    try {
      const res = await fetch("http://localhost:3000/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          opportunity_id: opportunity.opportunity_id,
          resume_url: resumeUrl,
        }),
      });

      const data = await res.json();
      setMessage(data.message || data.error || "Failed to apply");
    } catch (err) {
      console.error("Apply error:", err);
      setMessage("Failed to apply");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 8,
        padding: 20,
        marginTop: 16,
        maxWidth: 450,
        backgroundColor: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ margin: "0 0 12px 0", color: "#0a66c2" }}>
        Apply for {opportunity.title}
      </h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Paste your Resume URL (e.g. Google Drive / LinkedIn)"
          value={resumeUrl}
          onChange={(e) => setResumeUrl(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: 12,
            border: "1px solid #ccc",
            borderRadius: 6,
            fontSize: 14,
          }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 14px",
              marginRight: 8,
              border: "1px solid #ccc",
              borderRadius: 6,
              backgroundColor: "#f3f2ef",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Cancel
          </button>

          <button
            type="submit"
            style={{
              padding: "8px 14px",
              border: "none",
              borderRadius: 6,
              backgroundColor: "#0a66c2",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Submit
          </button>
        </div>
      </form>

      {message && (
        <p
          style={{
            marginTop: 12,
            color: message.includes("success") ? "green" : "red",
            fontSize: 14,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ApplyOpportunity;
