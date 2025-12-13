# 🎓 Alumni Network Portal

A full-stack web platform connecting students and alumni of JNEC, MGM University. Features opportunity posting, applications, networking, and real-time messaging.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Features

### 👥 **User Roles**
- **Students**: Browse opportunities, apply, network, chat
- **Alumni**: Post opportunities, review applications, connect with students
- **Admin**: Manage users, verify alumni, platform analytics

### 🔑 **Authentication & Security**
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting and security headers

### 💼 **Opportunity Management**
- Alumni can post job/internship opportunities
- Students can browse and filter opportunities
- Application tracking with status updates
- Email notifications for new opportunities

### 🔗 **Networking System**
- Send/accept connection requests
- User discovery and search
- Connection-based messaging
- Professional profiles

### 💬 **Real-time Messaging**
- Connection-based private messaging
- Message history and persistence
- Real-time updates with WebSocket
- Online/offline status

### 📧 **Notification System**
- Email notifications for applications
- Real-time in-app notifications
- Application status updates
- Connection request alerts

### 📊 **Dashboard & Analytics**
- Student application dashboard
- Alumni opportunity management
- Admin analytics panel
- Statistics and insights

## 🛠️ Tech Stack

### **Frontend**
- ⚛️ **React 18** - UI Library
- ⚡ **Vite** - Build Tool & Dev Server
- 🎨 **CSS-in-JS** - Styling
- 🔄 **React Router v6** - Navigation
- 📡 **Axios** - HTTP Client
- 🔌 **WebSocket** - Real-time communication

### **Backend**
- 🟢 **Node.js** - Runtime Environment
- 🚂 **Express.js** - Web Framework
- 🛡️ **JWT** - Authentication
- 🔐 **bcryptjs** - Password Hashing
- 📝 **Joi** - Input Validation
- 📧 **Nodemailer** - Email Service

### **Database**
- 🐬 **MySQL** - Relational Database
- 🔗 **mysql2** - Database Driver
- 📊 **Database Indexing** - Query Optimization

### **Services & APIs**
- 📧 **Brevo (Sendinblue)** - Email Service
- ☁️ **Cloudinary** - Image Storage (if applicable)
- 🌐 **RESTful API** - Backend Architecture

### **DevOps & Tools**
- 🐳 **Docker** - Containerization
- 🔄 **Git** - Version Control
- 🧪 **Jest** - Testing Framework
- 📦 **Postman** - API Testing
- 🌍 **CORS** - Cross-Origin Resource Sharing

## 📸 Screenshots

| Landing Page | Student Dashboard | Alumni Panel |
|--------------|-------------------|--------------|
| ![Landing](https://via.placeholder.com/400x250/0a66c2/ffffff?text=Landing+Page) | ![Student Dashboard](https://via.placeholder.com/400x250/0a66c2/ffffff?text=Student+Dashboard) | ![Alumni Panel](https://via.placeholder.com/400x250/0a66c2/ffffff?text=Alumni+Panel) |

| Opportunities | Connections | Messaging |
|---------------|-------------|-----------|
| ![Opportunities](https://via.placeholder.com/400x250/0a66c2/ffffff?text=Opportunities) | ![Connections](https://via.placeholder.com/400x250/0a66c2/ffffff?text=Connections) | ![Messaging](https://via.placeholder.com/400x250/0a66c2/ffffff?text=Messaging) |

## 🚀 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- MySQL 8.0+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/alumni-network-platform.git
   cd alumni-network-platform/backend
