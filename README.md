# Task Manager — Backend

Node.js + Express + PostgreSQL + Prisma

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` and fill in your PostgreSQL connection string and a JWT secret.

### 3. Run the database migration
```bash
npm run db:migrate
# When prompted, give the migration a name e.g. "init"
```
This creates the `User` and `Task` tables in your database.

### 4. Start the dev server
```bash
npm run dev
```
Server listens on `http://localhost:4000` by default.

---

## API Reference

### Auth

| Method | Route | Auth | Body |
|--------|-------|------|------|
| POST | `/api/auth/register` | — | `{ name, email, password }` |
| POST | `/api/auth/login` | — | `{ email, password }` |
| GET | `/api/auth/me` | ✓ | — |

Both register and login return `{ token, user }`.
Pass the token as `Authorization: Bearer <token>` on all protected routes.

### Tasks

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/tasks` | List your tasks. Optional query: `?status=todo&priority=high&sort=dueDate&order=asc` |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/:id` | Get one task |
| PUT | `/api/tasks/:id` | Update a task (send only fields to change) |
| DELETE | `/api/tasks/:id` | Delete a task |

**Task shape**
```json
{
  "id": "uuid",
  "title": "string",
  "description": "string | null",
  "status": "todo | in_progress | done",
  "priority": "low | medium | high",
  "dueDate": "ISO 8601 | null",
  "userId": "uuid",
  "createdAt": "ISO 8601",
  "updatedAt": "ISO 8601"
}
```

---

## Connect the React frontend

In `task-manager-client/.env`:
```
VITE_API_URL=http://localhost:4000/api
```

Then in the frontend, set `USE_MOCK = false` in:
- `src/api/tasks.js`
- `src/context/AuthContext.jsx`
