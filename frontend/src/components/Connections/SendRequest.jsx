import React, { useState } from "react";
import axios from "axios";

const SendRequest = () => {
  const [toUserId, setToUserId] = useState("");

  const sendRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/connections/send",   // ✅ fixed URL with backend port
        { to_user_id: toUserId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Request sent!");
      setToUserId("");
    } catch (err) {
      console.error("❌ sendRequest error:", err);
      alert("Failed to send request");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Send Connection Request</h2>
      <input
        type="number"
        placeholder="Enter user ID"
        value={toUserId}
        onChange={(e) => setToUserId(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={sendRequest}
        className="px-3 py-2 bg-blue-500 text-white rounded"
      >
        Send
      </button>
    </div>
  );
};

export default SendRequest;
