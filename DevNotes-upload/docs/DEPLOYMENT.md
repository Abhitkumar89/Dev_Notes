# DevNotes Deployment Guide

Deploy targets:

- **Frontend → Vercel**
- **Backend → Render**
- **Database → MongoDB Atlas**
- **Auth → Firebase**

Work through the sections in order. By the end you'll have a fully hosted app.

---

## 1. MongoDB Atlas

1. Create a free account at <https://www.mongodb.com/atlas> and create a **Shared (M0)** cluster.
2. **Database Access** → add a database user (username + password). Save these.
3. **Network Access** → add IP `0.0.0.0/0` (allow from anywhere) so Render can connect.
4. **Connect → Drivers** → copy the connection string. It looks like:

   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/devnotes?retryWrites=true&w=majority
   ```

   Replace `<user>` / `<password>` and keep `devnotes` as the database name. This is your `MONGO_URI`.

---

## 2. Firebase Setup

You need **two** sets of credentials from one Firebase project: a web config (frontend) and a service account (backend).

### Create the project & enable Google sign-in

1. Go to <https://console.firebase.google.com/> → **Add project**.
2. **Build → Authentication → Get started → Sign-in method → Google → Enable** → Save.
3. **Authentication → Settings → Authorized domains** → add your Vercel domain (e.g. `devnotes.vercel.app`) and `localhost` (already present).

### Web config (frontend)

1. **Project settings (gear) → General → Your apps → Web app (`</>`)** → register an app.
2. Copy the `firebaseConfig` values into the frontend env vars:

   | firebaseConfig key   | Frontend env var                    |
   | -------------------- | ----------------------------------- |
   | `apiKey`             | `VITE_FIREBASE_API_KEY`             |
   | `authDomain`         | `VITE_FIREBASE_AUTH_DOMAIN`         |
   | `projectId`          | `VITE_FIREBASE_PROJECT_ID`          |
   | `storageBucket`      | `VITE_FIREBASE_STORAGE_BUCKET`      |
   | `messagingSenderId`  | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
   | `appId`              | `VITE_FIREBASE_APP_ID`              |

### Service account (backend)

1. **Project settings → Service accounts → Generate new private key** → downloads a JSON file.
2. From that JSON, map into the backend env vars:

   | JSON field      | Backend env var          |
   | --------------- | ------------------------ |
   | `project_id`    | `FIREBASE_PROJECT_ID`    |
   | `client_email`  | `FIREBASE_CLIENT_EMAIL`  |
   | `private_key`   | `FIREBASE_PRIVATE_KEY`   |

   > **Important:** `FIREBASE_PRIVATE_KEY` contains newlines. When pasting into a dashboard,
   > keep it wrapped in double quotes with literal `\n` sequences, e.g.
   > `"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"`.
   > The backend converts `\n` back into real newlines automatically.

---

## 3. Backend → Render

You can deploy via the included `render.yaml` blueprint or manually.

### Option A — Blueprint (recommended)

1. Push the repo to GitHub.
2. On Render → **New → Blueprint** → select your repo. Render reads `render.yaml`.
3. Fill in the env vars marked `sync: false` (secrets) when prompted.

### Option B — Manual

1. Render → **New → Web Service** → connect your repo.
2. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
3. Add environment variables:

   | Key                     | Value                                            |
   | ----------------------- | ------------------------------------------------ |
   | `NODE_ENV`              | `production`                                      |
   | `PORT`                  | `5000`                                            |
   | `MONGO_URI`             | *(from Atlas)*                                    |
   | `JWT_SECRET`            | *(a long random string)*                         |
   | `JWT_EXPIRES_IN`        | `7d`                                             |
   | `CLIENT_URL`            | your Vercel URL, e.g. `https://devnotes.vercel.app` |
   | `FIREBASE_PROJECT_ID`   | *(from service account)*                          |
   | `FIREBASE_CLIENT_EMAIL` | *(from service account)*                          |
   | `FIREBASE_PRIVATE_KEY`  | *(from service account, quoted with `\n`)*        |

4. Deploy. Note the resulting URL: `https://<service>.onrender.com`.

> `CLIENT_URL` supports a comma-separated list if you have multiple frontends
> (e.g. preview + production): `https://devnotes.vercel.app,http://localhost:5173`.

---

## 4. Frontend → Vercel

1. Vercel → **Add New → Project** → import your repo.
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Add environment variables:

   | Key                                 | Value                                             |
   | ----------------------------------- | ------------------------------------------------- |
   | `VITE_API_URL`                      | `https://<service>.onrender.com/api`              |
   | `VITE_FIREBASE_API_KEY`             | *(web config)*                                    |
   | `VITE_FIREBASE_AUTH_DOMAIN`         | *(web config)*                                    |
   | `VITE_FIREBASE_PROJECT_ID`          | *(web config)*                                    |
   | `VITE_FIREBASE_STORAGE_BUCKET`      | *(web config)*                                    |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | *(web config)*                                    |
   | `VITE_FIREBASE_APP_ID`              | *(web config)*                                    |

4. Deploy. The included `frontend/vercel.json` rewrites all routes to `index.html`
   so client-side routing works on refresh.

---

## 5. Post-deploy checklist

- [ ] Backend health check returns `{ "status": "ok" }` at `/api/health`.
- [ ] `CLIENT_URL` on Render exactly matches your Vercel domain (no trailing slash).
- [ ] Vercel domain is added to Firebase **Authorized domains**.
- [ ] `VITE_API_URL` points at the Render URL **including** `/api`.
- [ ] Sign in with Google works end-to-end and a note can be created.

---

## Troubleshooting

| Symptom                                   | Likely cause / fix                                                       |
| ----------------------------------------- | ----------------------------------------------------------------------- |
| CORS error in browser console             | `CLIENT_URL` on Render doesn't match the Vercel origin exactly.         |
| `Firebase Admin is not configured`        | Missing/incorrect `FIREBASE_*` env vars on Render.                       |
| Google popup opens then "auth/unauthorized-domain" | Add the domain under Firebase → Authentication → Authorized domains. |
| `MongoServerError: bad auth`              | Wrong Atlas user/password or DB user not created.                       |
| 401 right after signing in                | `JWT_SECRET` changed between requests, or clock skew; re-login.          |
| Routes 404 on refresh (Vercel)            | Ensure `frontend/vercel.json` rewrites are present.                      |
| Render free tier cold start (slow first request) | Expected on free plan; first request after idle spins the service up. |
