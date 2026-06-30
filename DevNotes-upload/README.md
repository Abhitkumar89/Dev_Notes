# DevNotes

A production-ready, Notion-inspired **markdown notes app for developers**. Capture notes, code snippets and ideas with live markdown preview, syntax highlighting, categories, pinning and archiving — all behind Google authentication.

![Tech](https://img.shields.io/badge/stack-MERN-4f46e5) ![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

- **Google Sign-In** via Firebase Authentication (verified server-side, app-issued JWT)
- **Dashboard** with total / pinned / archived counts, recent notes and category breakdown
- **Notes** — create, edit, delete, pin, archive, search and filter by category
- **Markdown rendering** — headings, lists, tables, images, links and code blocks (GFM)
- **Syntax highlighting** for JavaScript, Python, Java, C++, HTML, CSS and more
- **Categories** — React, Node, DSA, Interview, JavaScript, Database (fully customisable)
- **Modern UI** — Notion-inspired, dark mode, responsive, sidebar, search, toasts and spinners

---

## Tech Stack

| Layer     | Technology                                                            |
| --------- | -------------------------------------------------------------------- |
| Frontend  | React, JavaScript (ES6+), Vite, Tailwind CSS, React Router, Axios     |
| Editor    | React Markdown, React Syntax Highlighter, remark-gfm                  |
| Backend   | Node.js, Express.js, MongoDB + Mongoose, JWT, Firebase Admin          |
| Auth      | Firebase Google Authentication + JSON Web Tokens                      |
| Database  | MongoDB Atlas                                                         |
| Deploy    | Frontend → Vercel · Backend → Render · DB → MongoDB Atlas             |

---

## Project Structure

```
DevNotes/
├── backend/
│   ├── src/
│   │   ├── config/        # db + firebase admin setup
│   │   ├── controllers/   # auth + notes business logic
│   │   ├── middleware/    # auth (JWT) + error handling
│   │   ├── models/        # Mongoose User + Note schemas
│   │   ├── routes/        # /api/auth + /api/notes
│   │   ├── utils/         # JWT helper
│   │   ├── app.js         # express app (middleware + routes)
│   │   └── server.js      # entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/           # axios instance + interceptors
│   │   ├── components/    # reusable UI (Sidebar, Navbar, NoteCard, ...)
│   │   ├── config/        # firebase web sdk
│   │   ├── context/       # Auth + Theme providers
│   │   ├── pages/         # Login, Dashboard, Notes, NoteView, Profile
│   │   ├── App.jsx        # routes
│   │   └── main.jsx       # entry point
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── API.md             # full API reference
│   └── DEPLOYMENT.md      # step-by-step deployment guide
├── render.yaml            # Render blueprint for the backend
└── README.md
```

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+ and npm
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A [Firebase](https://console.firebase.google.com/) project with Google sign-in enabled

### 1. Clone & install

```bash
git clone <your-repo-url> DevNotes
cd DevNotes

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

Copy the example files and fill in your values:

```bash
# backend/.env  (copy from backend/.env.example)
# frontend/.env (copy from frontend/.env.example)
```

**Backend (`backend/.env`):**

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=a-long-random-secret
JWT_EXPIRES_IN=7d
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Frontend (`frontend/.env`):**

```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> The Firebase **Web config** (frontend) and **Service Account** (backend) come from the same Firebase project — see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md#firebase-setup).

### 3. Run

```bash
# Terminal 1 - backend
cd backend
npm run dev

# Terminal 2 - frontend
cd frontend
npm run dev
```

Open <http://localhost:5173>.

---

## Available Scripts

**Backend**

| Command       | Description                       |
| ------------- | --------------------------------- |
| `npm run dev` | Start with nodemon (auto-reload)  |
| `npm start`   | Start in production mode          |

**Frontend**

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start Vite dev server        |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview the production build  |

---

## Documentation

- **[API Reference](docs/API.md)** — endpoints, request/response shapes, auth
- **[Deployment Guide](docs/DEPLOYMENT.md)** — Vercel + Render + MongoDB Atlas + Firebase

---

## License

MIT
