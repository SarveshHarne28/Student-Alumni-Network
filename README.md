# 🎓 Alumni Network Portal

A full-stack web platform connecting students and alumni of JNEC, MGM University. Features opportunity posting, applications, networking, and real-time messaging.

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
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up MySQL database**
   ```sql
   CREATE DATABASE alumni_network;
   CREATE USER 'alumni_app'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON alumni_network.* TO 'alumni_app'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. **Run database migrations**
   ```bash
   # Import the SQL file
   mysql -u root -p alumni_network < database/schema.sql
   ```

6. **Start the backend server**
   ```bash
   # Development
   npm run dev
  
   # Production
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your backend API URL
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```
