import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditOpportunity({ token, onClose }) {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "internship",
    status: "active",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const t = token || localStorage.getItem("token");

  // Fetch opportunity data
  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!t) {
        setMessage("Login required");
        setLoading(false);
        return;
      }
      
      try {
        // Use the same endpoint as MyOpportunities
        const res = await axios.get(
          "http://localhost:3000/api/opportunities/my-postings",
          { headers: { Authorization: `Bearer ${t}` } }
        );
        
        // Find the specific opportunity from the list
        const opportunity = res.data.find(opp => 
          opp.opportunity_id == opportunityId
        );
        
        if (opportunity) {
          setFormData({
            title: opportunity.title || "",
            description: opportunity.description || "",
            type: opportunity.type || "internship",
            status: opportunity.status || "active",
          });
        } else {
          setMessage("Opportunity not found");
        }
      } catch (err) {
        console.error("Fetch opportunity error:", err);
        setMessage(err.response?.data?.error || "Failed to fetch opportunity");
      } finally {
        setLoading(false);
      }
    };

    if (opportunityId) {
      fetchOpportunity();
    } else {
      setLoading(false);
      setMessage("No opportunity ID provided");
    }
  }, [opportunityId, t]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!t) return setMessage("Login required");

    try {
      // Use the same update endpoint that should work
      const res = await axios.put(
        `http://localhost:3000/api/opportunities/${opportunityId}`,
        formData,
        { headers: { Authorization: `Bearer ${t}` } }
      );
      setMessage(res.data.message || "Opportunity updated successfully");
      // Navigate back after successful update
      setTimeout(() => {
        if (onClose) onClose();
        else navigate("/manage-opportunities");
      }, 1500);
    } catch (err) {
      console.error("Update opp error:", err);
      setMessage(err.response?.data?.error || "Failed to update opportunity");
    }
  };

  const handleCancel = () => {
    if (onClose) onClose();
    else navigate("/manage-opportunities");
  };

  if (loading) return <div style={styles.container}><p>Loading opportunity data...</p></div>;

  return (
    <div style={styles.container}>
      <h3 style={{ marginBottom: "16px", color: "#0a66c2" }}>
        ✏️ Edit Opportunity
      </h3>
      <form onSubmit={handleUpdate}>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Opportunity Title"
          style={styles.input}
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          style={styles.textarea}
          required
        />
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="job">Job</option>
          <option value="internship">Internship</option>
          <option value="project">Project</option>
        </select>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={styles.select}
        >
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>
        <div style={styles.buttonContainer}>
          <button
            type="button"
            onClick={handleCancel}
            style={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={styles.submitButton}
          >
            Update Opportunity
          </button>
        </div>
      </form>
      {message && (
        <p style={{ 
          marginTop: "12px", 
          color: message.includes("Failed") || message.includes("error") || message.includes("not found") ? "red" : "green",
          textAlign: "center"
        }}>
          {message}
        </p>
      )}
    </div>
  );
}

const styles = {
  container: {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "16px",
    background: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    maxWidth: "500px",
    margin: "0 auto",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "12px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "12px",
    fontSize: "14px",
    minHeight: "80px",
    boxSizing: "border-box",
    resize: "vertical",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "12px",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
  },
  cancelButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    background: "#f3f2ef",
    cursor: "pointer",
    fontSize: "14px",
  },
  submitButton: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "none",
    background: "#0a66c2",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
};