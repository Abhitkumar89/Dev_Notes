# DevNotes API Reference

Base URL (local): `http://localhost:5000/api`
Base URL (prod): `https://<your-render-service>.onrender.com/api`

All responses are JSON. Authenticated endpoints require a Bearer token:

```
Authorization: Bearer <JWT>
```

The JWT is obtained from `POST /auth/google` and should be stored client-side
(the frontend stores it in `localStorage` as `devnotes_token`).

---

## Authentication

### `POST /auth/google`

Exchange a Firebase Google **ID token** for a DevNotes JWT. Creates the user on
first sign-in.

**Request body**

```json
{
  "idToken": "<firebase-id-token-from-client>"
}
```

**Response `200`**

```json
{
  "token": "<devnotes-jwt>",
  "user": {
    "id": "66e0b...",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "avatar": "https://lh3.googleusercontent.com/...",
    "categories": ["React", "Node", "DSA", "Interview", "JavaScript", "Database"]
  }
}
```

**Errors**: `400` missing token · `401` invalid/expired token or Firebase not configured.

---

### `GET /auth/me` 🔒

Return the authenticated user's profile.

**Response `200`**

```json
{
  "id": "66e0b...",
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "avatar": "https://...",
  "categories": ["React", "Node"],
  "createdAt": "2026-06-30T10:00:00.000Z"
}
```

---

### `PUT /auth/categories` 🔒

Replace the user's category list.

**Request body**

```json
{ "categories": ["React", "Node", "System Design"] }
```

**Response `200`**

```json
{ "categories": ["React", "Node", "System Design"] }
```

---

## Notes

All note endpoints are protected (🔒) and scoped to the authenticated user.

### `GET /notes` 🔒

List notes with optional filtering.

**Query parameters**

| Param      | Type   | Description                                                        |
| ---------- | ------ | ----------------------------------------------------------------- |
| `search`   | string | Case-insensitive match on title, content and tags                 |
| `category` | string | Filter by category (`All` = no filter)                            |
| `pinned`   | bool   | `true` → only pinned notes                                        |
| `archived` | enum   | `false` (default) hides archived · `true` only archived · `all`   |
| `sort`     | enum   | `recent` (default) · `oldest` · `title`                           |

**Response `200`** — array of notes (pinned first, then most recently updated):

```json
[
  {
    "_id": "66e0c...",
    "user": "66e0b...",
    "title": "Big-O Cheatsheet",
    "content": "# Big-O\n...",
    "category": "DSA",
    "tags": ["complexity"],
    "isPinned": true,
    "isArchived": false,
    "createdAt": "2026-06-30T10:05:00.000Z",
    "updatedAt": "2026-06-30T11:00:00.000Z"
  }
]
```

---

### `GET /notes/stats` 🔒

Dashboard statistics.

**Response `200`**

```json
{
  "total": 12,
  "pinned": 3,
  "archived": 2,
  "recent": [ /* up to 5 most recently updated notes */ ],
  "byCategory": [
    { "_id": "DSA", "count": 5 },
    { "_id": "React", "count": 4 }
  ]
}
```

---

### `GET /notes/:id` 🔒

Fetch a single note. Returns `404` if not found / not owned by the user.

---

### `POST /notes` 🔒

Create a note.

**Request body**

```json
{
  "title": "My note",
  "content": "# Hello\nMarkdown body",
  "category": "React",
  "tags": ["hooks"],
  "isPinned": false
}
```

All fields optional except that an empty title defaults to `"Untitled"`.

**Response `201`** — the created note.

---

### `PUT /notes/:id` 🔒

Update a note. Send only the fields you want to change.

**Updatable fields**: `title`, `content`, `category`, `tags`, `isPinned`, `isArchived`.

**Response `200`** — the updated note. `404` if not found.

---

### `DELETE /notes/:id` 🔒

Delete a note.

**Response `200`**

```json
{ "message": "Note deleted", "id": "66e0c..." }
```

---

## Utility

### `GET /health`

Public health check used by Render.

```json
{ "status": "ok", "uptime": 123.45 }
```

---

## Error format

All errors share a consistent shape:

```json
{
  "message": "Human readable message",
  "stack": "... (only in non-production) ..."
}
```

| Status | Meaning                          |
| ------ | -------------------------------- |
| 400    | Bad request / validation error   |
| 401    | Missing or invalid auth token    |
| 404    | Resource not found               |
| 429    | Rate limit exceeded              |
| 500    | Server error                     |

> Rate limit: 300 requests / 15 minutes per IP on `/api/*`.
