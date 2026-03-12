# 🚀 Mini Project Management System

A sleek, robust, and full-stack project management application built with the **MERN** stack. Designed with a modern dark-themed UI and a scalable backend architecture.

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Axios, React Router 7, Lucide Icons, Vanilla CSS
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Validation:** express-validator
- **State Management:** React hooks (useState, useEffect, useNavigate)

## ✨ Features

- **Project Management:**
  - Create projects with custom names and descriptions.
  - Paginated project overview (10 per page).
  - High-performance project deletion with **Cascade Logic** (automatically removes all linked tasks).
- **Task Management:**
  - Nested task creation per project.
  - Track tasks with **Statuses** (Todo, In-Progress, Done) and **Priorities** (Low, Medium, High).
  - Manage **Due Dates** for project timelines.
  - Inline editing and single-click deletion.
- **Advanced Querying:**
  - Filter tasks dynamically by status.
  - Sort tasks by due date to prioritize work.
- **Premium UI/UX:**
  - Responsive **Glassmorphism** design system.
  - Centralized error notifications and confirmation prompts.
  - Fast, modular components.

---

## 🚀 Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a MongoDB Atlas account.

### 2. Backend Configuration
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize environment variables in `.env`:
   ```bash
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/mini-project-management
   NODE_ENV=development
   ```
   > **Note:** We use `127.0.0.1` instead of `localhost` to avoid potential IPv6 connection issues on some Windows systems.

4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.

---

## 📡 API Documentation

### **Projects**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/projects` | Create a new project |
| **GET** | `/projects?page=1&limit=10` | List projects with pagination |
| **GET** | `/projects/:id` | Get single project details |
| **DELETE** | `/projects/:id` | Delete project (cascades to tasks) |

### **Tasks**
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/projects/:project_id/tasks` | Create task for a project |
| **GET** | `/projects/:project_id/tasks` | Get project tasks (filter/sort enabled) |
| **PUT** | `/tasks/:id` | Update task details/status |
| **DELETE** | `/tasks/:id` | Delete a specific task |

---
## 🌐 Live Demo

Frontend: [https://project-management-1-frontend.onrender.com/](https://project-management-1-frontend.onrender.com/)

Backend API: [https://your-backend-url.onrender.com/](https://project-management-t069.onrender.com/)
