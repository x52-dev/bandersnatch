# 🎓 Interactive Video Learning Platform (LMS)

A full-stack Learning Management System (LMS) built to empower educators and learners. Admins can upload videos, design interactive timeline-based quizzes, and track detailed learner analytics. Learners get a seamless, anti-cheat viewing experience with bulletproof auto-resume capabilities.

## 🏗 Architecture & Tech Stack

This platform is engineered with a modern, decoupled architecture designed for scalability, modularity, and smooth developer experience (DX).

* **Frontend:** React.js (Vite) + TailwindCSS
* *Highlights:* Custom anti-cheat video player, optimistic UI updates, glass-morphism timeline controls, and modular component design.


* **Backend:** NestJS (Node.js) + TypeScript
* *Highlights:* Strictly typed DTOs, modular resource domains (Videos, Users, Progress), automated Swagger documentation, and background telemetry endpoints.


* **Database:** MongoDB + Mongoose
* *Highlights:* Highly normalized schema design. `Progress` is detached from `User` and `Video` to prevent document bloat and ensure fast read/writes during rapid telemetry syncing.


* **Infrastructure:** Docker + Docker Compose
* *Highlights:* Multi-stage Nginx builds for React, isolated containers, and persistent local volume mapping for video uploads and database records.



---

## ✨ Key Features & Engineering Decisions (SDE II Highlights)

1. **Anti-Cheat Video Player:** Disabled native HTML5 controls to prevent learners from skipping checkpoints. Built a custom read-only timeline slider that visually displays progress and checkpoint markers (Amber for pending, Emerald for completed).
2. **Bulletproof Auto-Resume:** Solved the classic browser video metadata race condition. The React frontend monitors the native `readyState` and uses an event listener fallback to ensure the video seeks to the exact saved timestamp regardless of caching speeds.
3. **Guarded Telemetry Sync:** The background telemetry engine pings the NestJS backend every 5 seconds. To prevent it from overwriting the database with `currentTime: 0` before the auto-resume fires, a strict `hasRestoredTime` state gatekeeper is utilized.
4. **JSON Checkpoint Import:** Admins can rapidly build quizzes by importing a structured JSON file, which is automatically parsed and mapped to the timeline state.
5. **Robust Fallbacks:** Implemented instant placeholder fallbacks for broken thumbnail URLs and safely mapped multi-select arrays for robust quiz grading.

---

## 🚀 Getting Started (Docker - Recommended)

The easiest way to run the entire stack (Database, Backend, Frontend) is using Docker.

### Prerequisites

* [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

### 1. Environment Variables
Rename .env.example in both frontend and backen to .env or,
Create a `.env` file in the `backend` directory (if not already present) with the following :

```env
PORT=3000
MONGODB_URI=mongodb://mongodb:27017/lms_database
JWT_SECRET=super_secret_jwt_key_for_evaluation

```

### 2. Run the Application

From the root directory (where `docker-compose.yml` is located), run:

```bash
docker compose up --build -d

```

### 3. Access the Platform

* **Frontend Application:** [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080)
* **Backend API:** `http://localhost:3000/api`
* **Swagger API Docs:** [http://localhost:3000/api-docs](https://www.google.com/search?q=http://localhost:3000/api-docs)

*(Note: Uploaded videos are securely persisted to your local machine via Docker volume mapping in `./backend/uploads`).*

---

## 💻 Manual Local Setup (Without Docker)

If you prefer to run the application manually, ensure you have **Node.js (v18+)** and a local **MongoDB** instance running.

**Backend Setup:**

```bash
cd backend
npm install
# Ensure MONGODB_URI in .env points to localhost: mongodb://localhost:27017/lms_database
npm run start:dev

```

**Frontend Setup:**

```bash
cd frontend
npm install
npm run dev
# App will run on http://localhost:5173

```

---


---

## 📚 API Documentation

The backend utilizes the NestJS Swagger CLI plugin for automated, real-time documentation mapping.

1. Start the backend server (via Docker or locally).
2. Navigate to **[http://localhost:3000/api-docs](https://www.google.com/search?q=http://localhost:3000/api-docs)** in your browser.
3. You can interact with the endpoints directly from the Swagger UI, or download the JSON spec at `http://localhost:3000/api-docs-json` to import directly into **Postman**.

---

## ⚠️ Assumptions & Known Limitations

* **File Storage:** Videos are stored locally in the `/uploads` directory to keep the assessment self-contained. In a production environment, this would be swapped with an AWS S3/CloudFront integration.
* **Video Processing:** Video processing (compression/transcoding) is visually mocked in the UI for the sake of scope.
* **Short Answer Grading:** Short answer evaluation currently requires an exact string match (case-insensitive). In a true production LMS, this would likely leverage an LLM or fuzzy-matching algorithm for accurate semantic grading.
* **Security:** Rate-limiting and helmet security headers were omitted to focus purely on the core architectural requirements of the assessment.
