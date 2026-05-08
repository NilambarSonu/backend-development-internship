# Scalable Task Management System

A full-stack application featuring a robust REST API with Authentication, Role-Based Access Control (RBAC), and a premium Apple-Notes-style dashboard.

## 🚀 Live Demo
- **Frontend:** [To be updated after Render deployment]
- **Backend API:** [To be updated after Render deployment]
- **API Documentation (Swagger):** `/api-docs`

---

## ✨ Key Features

### Backend (Node.js/Express/Prisma)
- **JWT Authentication:** Secure user registration and login with password hashing (bcrypt).
- **Role-Based Access Control (RBAC):** Middleware for differentiating between `user` and `admin` roles.
- **Task CRUD with Soft Delete:** Full task management with a "Recently Deleted" (Trash) feature.
- **Optimized Performance:** Implemented connection pooling for Supabase/Postgres.
- **API Versioning:** All routes prefixed with `/api/v1`.
- **API Documentation:** Integrated Swagger UI for interactive testing.

### Frontend (React/Vite/Lucide)
- **Premium Apple-Style UI:** A clean, dark-mode dashboard inspired by Apple Notes.
- **Optimistic UI:** Instant task creation feedback for a smooth user experience.
- **Smart Folders:** Filter notes by status (Pending, In Progress, Completed).
- **Trash Management:** Restore or permanently delete notes from the "Recently Deleted" section.

---

## 🛠 Tech Stack
- **Frontend:** React.js, Vite, TailwindCSS (for base), Lucide-React
- **Backend:** Node.js, Express, Prisma ORM
- **Database:** PostgreSQL (via Supabase)
- **Security:** JWT, Helmet, CORS, Express-Validator

---

## 📖 API Documentation (V1)

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive JWT |
| GET | `/api/v1/auth/profile` | Get logged-in user details |

### Tasks
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/v1/tasks` | Get all active tasks |
| POST | `/api/v1/tasks` | Create a new task (Optimistic) |
| GET | `/api/v1/tasks/:id` | Get single task details |
| PUT | `/api/v1/tasks/:id` | Update task content/status |
| DELETE | `/api/v1/tasks/:id` | Move task to trash (Soft Delete) |
| GET | `/api/v1/tasks/deleted` | View items in trash |
| PUT | `/api/v1/tasks/:id/restore` | Restore task from trash |
| DELETE | `/api/v1/tasks/:id/permanent`| Permanently delete task |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database (Supabase recommended)

### 1. Clone & Install
```bash
git clone [Your Repo URL]
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:pass@host:port/db?pgbouncer=true&connection_limit=1"
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Database Migration
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Run Development
- **Backend:** `npm run dev` (Port 5000)
- **Frontend:** `npm run dev` (Port 5173)

---

## 📈 Scalability & Deployment
This project is configured for **Render Blueprint** deployment. See `render.yaml` in the root directory for configuration details.

- **Stateless Auth:** Scalable horizontally across multiple instances.
- **Connection Pooling:** Uses PgBouncer for efficient database connections.
- **Separation of Concerns:** Clean architecture with dedicated controllers, routes, and middlewares.
