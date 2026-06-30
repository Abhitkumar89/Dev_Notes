# DevNotes — Complete Step-by-Step Setup (Zero to Running)

This guide takes you from an empty machine to a fully working DevNotes app — first
running **locally**, then **deployed online**. Follow every step in order. No step is optional.

> You only need to fill in **values** (keys, URLs, passwords). All the code is already written.

---

## Part 0 — Install the tools (one time)

1. **Node.js 18+** — download the LTS installer from <https://nodejs.org> and install it.
   Verify in a terminal:
   ```bash
   node -v
   npm -v
   ```
2. **A code editor** — VS Code or Cursor (you already have this).
3. **A Google account** — needed for Firebase + MongoDB Atlas + Google sign-in.

---

## Part 1 — Create the Database (MongoDB Atlas)

You need a connection string (`MONGO_URI`).

1. Go to <https://www.mongodb.com/atlas> → sign up / log in.
2. Click **Create** → choose **M0 (Free)** → pick any cloud/region → **Create deployment**.
3. A popup "Connect to your cluster" appears:
   - **Create a database user**: enter a username (e.g. `devnotes`) and a password.
     **Write both down** — you need them in the URI.
   - Click **Create database user**.
4. Left sidebar → **Network Access** → **Add IP Address** → **Allow access from anywhere**
   (`0.0.0.0/0`) → **Confirm**. (Required so your app/Render can connect.)
5. Left sidebar → **Database** → **Connect** → **Drivers** → copy the connection string.
   It looks like:
   ```
   mongodb+srv://devnotes:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Edit it:
   - Replace `<password>` with the real password.
   - Add the database name `devnotes` right before the `?`:
   ```
   mongodb+srv://devnotes:YOURPASSWORD@cluster0.xxxxx.mongodb.net/devnotes?retryWrites=true&w=majority
   ```
   ➡️ **This final string is your `MONGO_URI`.** Keep it handy.

---

## Part 2 — Create the Firebase project (Google Sign-In)

You'll get **two** sets of values: a **Web config** (for the frontend) and a
**Service Account** (for the backend).

### 2a. Create project + enable Google login

1. Go to <https://console.firebase.google.com/> → **Add project** → give it a name
   (e.g. `devnotes`) → continue (you can disable Analytics) → **Create project**.
2. Left menu → **Build → Authentication** → **Get started**.
3. **Sign-in method** tab → click **Google** → toggle **Enable** → choose a support
   email → **Save**.

### 2b. Get the Web config (frontend values)

1. Click the **gear icon ⚙ → Project settings**.
2. Scroll to **Your apps** → click the **Web `</>`** icon → register an app
   (nickname `devnotes-web`, no hosting needed) → **Register app**.
3. Firebase shows a `firebaseConfig` object. Copy these 6 values — you'll paste them
   into `frontend/.env`:

   | firebaseConfig field | Goes into env var                   |
   | -------------------- | ----------------------------------- |
   | `apiKey`             | `VITE_FIREBASE_API_KEY`             |
   | `authDomain`         | `VITE_FIREBASE_AUTH_DOMAIN`         |
   | `projectId`          | `VITE_FIREBASE_PROJECT_ID`          |
   | `storageBucket`      | `VITE_FIREBASE_STORAGE_BUCKET`      |
   | `messagingSenderId`  | `VITE_FIREBASE_MESSAGING_SENDER_ID` |
   | `appId`              | `VITE_FIREBASE_APP_ID`              |

### 2c. Get the Service Account (backend values)

1. Still in **Project settings** → **Service accounts** tab.
2. Click **Generate new private key** → **Generate key**. A `.json` file downloads.
3. Open that JSON file. You need 3 fields for `backend/.env`:

   | JSON field     | Goes into env var       |
   | -------------- | ----------------------- |
   | `project_id`   | `FIREBASE_PROJECT_ID`   |
   | `client_email` | `FIREBASE_CLIENT_EMAIL` |
   | `private_key`  | `FIREBASE_PRIVATE_KEY`  |

   ⚠️ The `private_key` is long and contains `\n`. Copy it **exactly** including the
   quotes, e.g.:
   ```
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv....\n-----END PRIVATE KEY-----\n"
   ```

### 2d. Allow your local site (and later your live site)

1. **Authentication → Settings → Authorized domains**.
2. `localhost` is already there. Later (after deploying) come back and **Add domain**
   for your Vercel URL (e.g. `devnotes.vercel.app`).

---

## Part 3 — Create the environment files

The repo ships with `.env.example` files. You must create real `.env` files next to them.

### 3a. Backend — create `backend/.env`

Create a file named exactly `.env` inside the `backend` folder with this content
(fill in your values from Part 1 & 2c):

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb+srv://devnotes:YOURPASSWORD@cluster0.xxxxx.mongodb.net/devnotes?retryWrites=true&w=majority

JWT_SECRET=paste-any-long-random-string-here-min-32-chars
JWT_EXPIRES_IN=7d

FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n....\n-----END PRIVATE KEY-----\n"
```

> Tip for `JWT_SECRET`: just mash the keyboard for 40+ characters, or run
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

### 3b. Frontend — create `frontend/.env`

Create a file named exactly `.env` inside the `frontend` folder (values from Part 2b):

```env
VITE_API_URL=http://localhost:5000/api

VITE_FIREBASE_API_KEY=your-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:xxxxxxxx
```

---

## Part 4 — Install & run locally

Open **two terminals**.

**Terminal 1 — backend:**
```bash
cd backend
npm install
npm run dev
```
You should see: `MongoDB connected...` and `Running in development mode on port 5000`.

**Terminal 2 — frontend:**
```bash
cd frontend
npm install
npm run dev
```
It prints a local URL (usually <http://localhost:5173>). Open it in your browser.

✅ Click **Continue with Google**, pick your account, and you're in. Create a note,
add some markdown and a code block, pin it, and check the Dashboard counts.

### Quick local checklist if something fails
- Backend terminal shows `MongoDB connected` → if not, your `MONGO_URI` is wrong.
- Google popup says "unauthorized domain" → add `localhost` in Firebase Authorized domains.
- "Firebase Admin is not configured" in backend → the 3 `FIREBASE_*` backend vars are missing/wrong.
- Login spins forever / network error → backend isn't running, or `VITE_API_URL` is wrong.

---

## Part 5 — Put the code on GitHub

You can drag-and-drop, no Git commands needed:

1. Go to <https://github.com> → **New repository** → name it `devnotes` → **Create**.
2. On the empty repo page click **uploading an existing file**.
3. Open the **`DevNotes-upload`** folder I generated for you (it excludes
   `node_modules` and your secret `.env` files).
4. Select everything inside it and **drag it into the GitHub upload area**.
5. Scroll down → **Commit changes**.

> Never upload `.env` files or `node_modules` — the clean folder already leaves them out.

---

## Part 6 — Deploy the Backend (Render)

1. Go to <https://render.com> → sign up with GitHub.
2. **New → Web Service** → connect your `devnotes` repo.
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Scroll to **Environment** → add these variables (same values as `backend/.env`,
   except `CLIENT_URL` which you'll set after Part 7; for now put a placeholder):

   | Key | Value |
   | --- | ----- |
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | *(your Atlas string)* |
   | `JWT_SECRET` | *(your long secret)* |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | `http://localhost:5173` *(update later)* |
   | `FIREBASE_PROJECT_ID` | *(service account)* |
   | `FIREBASE_CLIENT_EMAIL` | *(service account)* |
   | `FIREBASE_PRIVATE_KEY` | *(service account, with quotes + `\n`)* |
5. **Create Web Service**. When it's live, copy the URL, e.g.
   `https://devnotes-backend.onrender.com`.
6. Test it: open `https://devnotes-backend.onrender.com/api/health` → should show
   `{"status":"ok"}`.

---

## Part 7 — Deploy the Frontend (Vercel)

1. Go to <https://vercel.com> → sign up with GitHub → **Add New → Project** → import
   your `devnotes` repo.
2. Settings:
   - **Root Directory:** `frontend`
   - Framework is auto-detected as **Vite**.
3. **Environment Variables** → add all the `VITE_*` values from `frontend/.env`,
   **but** change:
   ```
   VITE_API_URL=https://devnotes-backend.onrender.com/api
   ```
   (use your real Render URL, and keep the `/api` at the end).
4. **Deploy**. You'll get a URL like `https://devnotes.vercel.app`.

---

## Part 8 — Connect the two (final wiring)

1. **Render → your service → Environment** → set `CLIENT_URL` to your Vercel URL
   (e.g. `https://devnotes.vercel.app`, **no trailing slash**) → save (it redeploys).
2. **Firebase → Authentication → Settings → Authorized domains → Add domain** →
   add `devnotes.vercel.app`.
3. Open your Vercel URL → **Continue with Google** → create a note. 🎉

---

## Common deployment gotchas

| Problem | Fix |
| ------- | --- |
| CORS error in browser | `CLIENT_URL` on Render must exactly equal your Vercel URL (no trailing `/`). |
| `auth/unauthorized-domain` | Add the Vercel domain in Firebase → Authorized domains. |
| Login works locally but not live | `VITE_API_URL` on Vercel must be the Render URL **+ `/api`**. |
| First request after a while is slow | Render free tier "sleeps"; the first call wakes it (~30s). |
| `bad auth` in Render logs | Wrong Atlas username/password in `MONGO_URI`. |

---

That's it — local dev in Part 4, fully deployed by Part 8.
