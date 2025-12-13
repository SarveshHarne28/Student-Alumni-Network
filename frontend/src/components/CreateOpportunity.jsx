import React, { useState } from "react";
import axios from "axios";

export default function CreateOpportunity({ token, onCreated }) {
  const [formData, setFormData] = useState({
    company_name: "",
    title: "",
    description: "",
    type: "internship", // default
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const t = token || localStorage.getItem("token");
    if (!t) return setMessage("Login required");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/opportunities",
        formData,
        { headers: { Authorization: `Bearer ${t}` } }
      );
      setMessage(res.data.message || "Created");
      setFormData({
        company_name: "",
        title: "",
        description: "",
        type: "internship",
      });
      if (onCreated) onCreated();
    } catch (err) {
      console.error("Create opp error:", err);
      setMessage(err.response?.data?.error || "Error creating opportunity");
    }
  };

  const containerStyle = {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
    fontFamily: "Segoe UI, Roboto, sans-serif",
  };

  const headingStyle = {
    marginBottom: "16px",
    fontSize: "20px",
    fontWeight: "600",
    color: "#0a66c2", // LinkedIn blue
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "0.2s border-color",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "80px",
    resize: "vertical",
  };

  const selectStyle = {
    ...inputStyle,
    backgroundColor: "#fff",
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    marginTop: "12px",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    backgroundColor: "#0a66c2",
    color: "#fff",
    cursor: "pointer",
    transition: "0.3s background-color",
  };

  const messageStyle = {
    marginTop: "12px",
    fontSize: "14px",
    color: message.includes("Error") ? "red" : "green",
  };

  return (
    <div style={containerStyle}>
      <h3 style={headingStyle}>Create Opportunity</h3>
      <form onSubmit={handleSubmit}>
        <input
          style={inputStyle}
          name="company_name"
          placeholder="Company name"
          value={formData.company_name}
          onChange={handleChange}
          required
        />
        <input
          style={inputStyle}
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          style={textareaStyle}
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <select
          style={selectStyle}
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="job">Job</option>
          <option value="internship">Internship</option>
        </select>
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#004182")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0a66c2")}
        >
          Create
        </button>
      </form>
      {message && <p style={messageStyle}>{message}</p>}
    </div>
  );
}
