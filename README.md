# Vamint Club Management System

Welcome to the **Vamint Club Management System**! This is a full-stack application designed to help manage club activities, track student attendance, organize lectures, and oversee club administration.

## 🚀 Live Demo Access

> **⚠️ Important Note on Performance:** The backend is hosted on Render's free tier. If the application hasn't been used in the last 15 minutes, the server will "spin down" to save resources. **The first time you try to log in, it may take 30 to 50 seconds for the backend to wake up.** Please be patient! After it wakes up, all subsequent requests will be lightning fast.

The application is seeded with default data so you can test it immediately upon deployment.

### Admin Login
- **Email:** `admin@vamint.com`
- **Password:** `admin123`

### Student Login
- **Email:** `pravin@vamint.com`
- **Password:** `student123`

*(Additional student accounts like `student2@vamint.com` with password `student123` are also available.)*

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Recharts (for analytics dashboards)
- **Backend:** Java 17, Spring Boot, Spring Data JPA
- **Database:** MySQL
- **Media Storage:** Cloudinary (for profile pictures)
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## 💻 Local Development Setup

If you want to run this application locally on your own machine, follow these steps:

### Prerequisites
- Node.js (v18+)
- Java 17 (JDK)
- MySQL Database

### 1. Database Setup
1. Create a local MySQL database (e.g., `vamint_db`).
2. The application will automatically create the required tables and insert the demo data on the first run.

### 2. Backend Setup (Spring Boot)
1. Navigate to the `backend` directory.
2. Open `src/main/resources/application.properties` and update your local database credentials if necessary.
3. Run the backend using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(The backend runs on `http://localhost:8080`)*

### 3. Frontend Setup (React/Vite)
1. Navigate to the `frontend` directory.
2. Install the necessary dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *(The frontend runs on `http://localhost:5173`)*

---

## 🌍 Deployment Configuration

The deployment instructions have been heavily documented. If you are deploying this project to production:

1. Refer to the **`DEPLOYMENT.md`** file located in the root directory for a complete step-by-step guide.
2. The Backend uses a `Dockerfile` for seamless deployment to Render.
3. The Frontend is configured to dynamically read the `VITE_API_URL` environment variable for production.

---

## 📸 Features Overview

- **Admin Dashboard:** Total control over students, other admins, and lectures.
- **Attendance Tracking:** Real-time pie charts and bar graphs for lecture attendance. Quick actions to mark all present/absent.
- **Student Portal:** Students can view their upcoming lectures and track their own attendance statistics.
- **Image Uploads:** Fully integrated Cloudinary image upload for user profile pictures.
