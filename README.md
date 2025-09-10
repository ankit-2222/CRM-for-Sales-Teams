# ⭐ Sales CRM — Full-Stack Customer Relationship Management Platform 🚀

A comprehensive CRM platform built with **Next.js 13**, **MongoDB**, and **TypeScript**. Manage leads, track opportunities, and monitor sales pipeline with ease. Features role-based access control, dashboard analytics, and a modern responsive interface.

![Next.js](https://img.shields.io/badge/Next.js-13.x-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Tailwind](https://img.shields.io/badge/CSS-Tailwind-38bdf8)
![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-ff69b4)

---

## 📌 Overview

**Sales CRM** is a modern full-stack CRM with two main roles:

- **USER** — manage leads, convert leads to opportunities, track sales pipeline, view dashboard
- **ADMIN** — manage users, view system-wide analytics, configure system settings

All data is validated and secured with JWT authentication. The platform provides a seamless experience for managing customer relationships and sales processes.

---

## ✨ Features

- ✅ **Modern Stack**: Next.js 13 with App Router and Server Components
- ✅ **Authentication**: JWT-based auth with protected routes
- ✅ **Lead Management**: Create, update, and track leads
- ✅ **Opportunity Pipeline**: Convert leads to opportunities and track sales stages
- ✅ **Dashboard Analytics**: Visual insights into sales performance
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile
- ✅ **Role-based Access**: Different capabilities for users and admins
- ✅ **Security Features**: 
  - JWT Authentication
  - Protected API Routes
  - Input Validation
  - Secure Password Handling

---

## 🧰 Tech Stack

| Layer      | Technology                    |
|------------|------------------------------|
| Framework  | Next.js 13                   |
| Database   | MongoDB                      |
| Language   | TypeScript                   |
| Styling    | Tailwind CSS                |
| Auth       | JWT + bcrypt                |
| State      | React Context               |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # App router pages
│   │   ├── (auth)/            # Auth routes (login/signup)
│   │   ├── api/               # API routes
│   │   ├── admin/             # Admin pages
│   │   ├── leads/             # Lead management
│   │   └── opportunities/     # Opportunity management
│   ├── components/            # Reusable components
│   ├── context/               # Auth context
│   └── lib/                   # Utilities and helpers
├── public/                    # Static assets
└── package.json
```

## ⚙️ Getting Started

### Prerequisites
- Node.js **v18+**
- MongoDB
- Git

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/ankit-2222/CRM-for-Sales-Teams.git
cd CRM-for-Sales-Teams/frontend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Run the development server
```bash
npm run dev
# Application will be available at http://localhost:3000
```

---

## 🔑 Key Features

### Lead Management
- Create and track new leads
- Convert leads to opportunities
- Track lead source and status

### Opportunity Pipeline
- Stage-based sales pipeline
- Track deal values and progress
- Conversion analytics

### Admin Dashboard
- User management
- System-wide analytics
- Configuration settings

---

## 🛡️ Authentication

The application uses JWT-based authentication with the following features:
- Secure token storage
- Protected API routes
- Role-based access control
- Automatic token refresh

---

## 🔐 Environment Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crm?retryWrites=true&w=majority

# JWT Secret (use a strong random string in production)
JWT_SECRET=your-very-long-random-secret-key-here

# Next.js Environment
NODE_ENV=development
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
