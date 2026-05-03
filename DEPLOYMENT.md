# 🚀 Complete Deployment Guide (Render)

This guide provides the exact steps to deploy your **Spring Boot Backend** and **React (Vite) Frontend** on [Render](https://render.com) for free, using your existing hosted MySQL database.

---

## 🛑 Step 1: Push Your Code to GitHub

Render pulls your code directly from GitHub.

1. Create a free account on [GitHub](https://github.com) if you haven't already.
2. Initialize Git in your project root and push it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for deployment"
   git branch -M main
   # Create a repository on GitHub, then link it:
   git remote add origin https://github.com/YOUR_USERNAME/vamint-club.git
   git push -u origin main
   ```
*(We've already updated your `.gitignore` to safely exclude local `.sql`, `.md`, and `.env` files from being pushed).*

---

## ⚙️ Step 2: Deploy the Spring Boot Backend

1. Create an account on [Render](https://render.com) and log in.
2. Click **New +** and select **Web Service**.
3. Connect your GitHub account and select your `vamint-club` repository.
4. Fill in the deployment settings:
   - **Name:** `vamint-backend`
   - **Environment:** `Docker` *(Render will automatically detect our new Dockerfile)*
   - **Branch:** `main`
   - **Root Directory:** `backend` (Important!)
   *(Note: Build Command and Start Command are not needed for Docker)*
5. Scroll down to **Environment Variables** and add your Cloudinary and Database credentials:
   - `JDBC_DATABASE_URL` = `jdbc:mysql://sql5.freesqldatabase.com:3306/sql5825040?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true`
   - `JDBC_DATABASE_USERNAME` = `sql5825040`
   - `JDBC_DATABASE_PASSWORD` = `rJzqP3a6Ip`
   - `CLOUDY_API_KEY` = `799916847653917`
   - `CLOUDY_API_SECRET` = `QT18TMSZPNzEr2RDFE8WZNhfXLo`
6. Click **Create Web Service**.

> **Note:** Render will build your Maven project. Once it says "Live", copy the URL (e.g., `https://vamint-backend.onrender.com`). You will need this for the frontend!

---

## 🎨 Step 3: Deploy the React (Vite) Frontend

1. Go back to the Render dashboard.
2. Click **New +** and select **Static Site**.
3. Select the same `vamint-club` repository.
4. Fill in the deployment settings:
   - **Name:** `vamint-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend` (Important!)
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
5. Scroll down to **Environment Variables** and add:
   - `VITE_API_URL` = `https://vamint-backend.onrender.com` *(Replace with the URL you copied from Step 2)*
6. Click **Create Static Site**.

---

## ✅ Step 4: Add Redirect Rule for React Router

Because React uses client-side routing, you need to tell Render to redirect all traffic to `index.html`.

1. Go to your frontend project dashboard on Render.
2. Click **Redirects/Rewrites** in the left sidebar.
3. Add the following rule:
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`
4. Click **Save Changes**.

---

## 🎉 Verification

1. Open your frontend URL (e.g., `https://vamint-frontend.onrender.com`).
2. Try logging in with the default admin account:
   - **Email:** `admin@vamint.com`
   - **Password:** `admin123`
3. Your app is now live globally!

> **Warning:** Render's free tier spins down your backend after 15 minutes of inactivity. When you visit the app after a break, the first API request might take 30-50 seconds while the server wakes up.
