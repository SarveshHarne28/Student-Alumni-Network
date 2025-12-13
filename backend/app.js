// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// ✅ ADD THIS LINE - Import authenticate middleware
const { authenticate } = require('./src/middleware/auth.middleware');

const app = express();
const pool = require('./config/db');

// Middlewares
app.use(helmet());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// DEBUG ROUTE - Test if server is working
app.get('/api/debug', (req, res) => {
  res.json({ message: 'Backend is running!', timestamp: new Date() });
});

// Routes
const authRoutes = require('./src/routes/auth.routes');
const opportunityRoutes = require('./src/routes/opportunity.routes');
const adminRoutes = require('./src/routes/admin.routes');
const applicationsRoutes = require('./src/routes/applications.routes');
const applicationRoutes = require('./src/routes/application.routes');
const connectionRoutes = require('./src/routes/connection.routes');
const messageRoutes = require('./src/routes/message.routes');
const profileRoutes = require('./src/routes/profile.routes');
// ✅ ADD THIS LINE - Import user routes
const userRoutes = require('./src/routes/user.routes');

app.use('/api/auth', authRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/profile', profileRoutes);
// ✅ ADD THIS LINE - Use user routes
app.use('/api/users', userRoutes);

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV || 'development' });
});

// Global 404
app.use((req, res) => {
  console.log('❌ 404 Not Found:', req.method, req.url);
  res.status(404).json({ error: 'Not Found' });
});

module.exports = app;