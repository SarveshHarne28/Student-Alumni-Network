// components/MessageNotification.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = "http://localhost:3000/api";

export const MessageNotification = () => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    checkUnreadMessages();
    const interval = setInterval(checkUnreadMessages, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const checkUnreadMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      // You might need to create this endpoint in your backend
      const res = await axios.get(`${API_BASE}/messages/unread/count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadCount(res.data.count || 0);
    } catch (err) {
      console.error('Error checking unread messages:', err);
    }
  };

  if (unreadCount === 0) return null;

  return (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {unreadCount}
    </span>
  );
};