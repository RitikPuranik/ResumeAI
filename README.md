# ResumeAI

AI-powered career companion for building stronger resumes, analyzing ATS compatibility, preparing for interviews, matching jobs, and generating tailored career documents.

## ✨ What it does

ResumeAI brings several job-search and interview tools into one platform:

- **AI Resume Tools** – upload and manage resumes and get AI-assisted improvements.
- **ATS Analysis** – evaluate a resume against ATS-focused criteria and identify areas to improve.
- **AI Interview Practice** – prepare for interviews with AI-driven interview sessions and evaluations.
- **Job Matching** – compare a candidate profile/resume with job opportunities.
- **Cover Letter Generation** – create tailored cover letters for specific applications.
- **Progress Tracking** – track preparation and career progress over time.
- **Authentication & User Profiles** – secure accounts and user-specific data.
- **Subscriptions, Payments & Coupons** – support premium features, Razorpay payments, and configurable coupons.
- **Speech Features** – voice-oriented interview functionality.

## 🏗️ Tech Stack

### Frontend
- React 19
- Vite
- React Router
- TanStack React Query
- Zustand
- Axios
- React Hook Form + Zod
- Tailwind CSS
- Framer Motion
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Groq / Gemini-compatible AI integration
- Cloudinary
- Razorpay
- Puppeteer
- PDF parsing
- Helmet + CORS + rate limiting

## 📁 Project Structure

```text
ResumeAI/
├── frontend/        # React + Vite client
├── backend/         # Express API
│   ├── src/
│   │   ├── modules/ # Auth, resume, ATS, interview, evaluation, etc.
│   │   ├── config/
│   │   └── shared/
│   └── server.js
├── LICENSE
└── README.md
```

The backend is organized into feature modules for authentication, users, resumes, ATS analysis, interviews, evaluations, speech, job matching, cover letters, progress, subscriptions, and coupons.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ recommended
- MongoDB (local or MongoDB Atlas)
- API credentials for the services you plan to use

### 1. Clone the repository

```bash
git clone https://github.com/RitikPuranik/ResumeAI.git
cd ResumeAI
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file using the provided example:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Set the required values in `.env`, including your MongoDB connection string, JWT secret, AI API key, Razorpay credentials, Cloudinary credentials, and allowed frontend origins.

### 3. Start the backend

Development:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

The API includes a health endpoint at:

```text
GET /health
```

### 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Then open the Vite URL shown in the terminal.

## 🔐 Environment Variables

The backend keeps secrets out of source control through environment variables. Use `backend/.env.example` as the template.

Typical configuration includes:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
GROQ_API_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CORS_ORIGIN=http://localhost:5173
```

Never commit real secrets or production credentials to GitHub.

## 🧠 Backend API Areas

The backend exposes modular API routes for:

```text
/api/auth
/api/users
/api/resumes
/api/ats
/api/interviews
/api/evaluation
/api/speech
/api/jobmatch
/api/coverletter
/api/progress
/api/subscription
/api/coupons
```

## 🛡️ Security

The API includes security-focused middleware such as:

- Helmet security headers
- CORS origin control
- Global request rate limiting
- Stricter rate limiting for authentication routes
- JWT-based authentication
- Request validation

## 📦 Available Scripts

### Frontend

```bash
npm run dev      # Start Vite development server
npm run build    # Build production bundle
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Backend

```bash
npm run dev      # Start backend with nodemon
npm start        # Start backend with Node.js
```

## 🌐 Deployment Notes

For deployment, configure production environment variables and update `CORS_ORIGIN` to the deployed frontend origin(s). The backend can be deployed independently from the frontend.

Do not expose private API keys, JWT secrets, payment secrets, or Cloudinary secrets in frontend code.

## 📜 License

This project is licensed under the **MIT License**. See the [`LICENSE`](./LICENSE) file for details.

## 👨‍💻 Project

**ResumeAI** is a full-stack AI career platform built to help students and job seekers improve resumes, practice interviews, and prepare for real-world applications.
