# Social Media Manager AI Agent

This project has two apps:

- `backend/` → Express API + OpenAI generation
- `frontend/social-agent-ai/` → React + Vite UI

A helper `frontend/package.json` is included so common frontend commands also work from `frontend/`.

## Quick start

### 1) Backend

```bash
cd backend
npm install
npm run start
```

Create a `.env` file in `backend/` with:

```bash
OPENAI_API_KEY=your_api_key_here
```

Backend runs on `http://localhost:5000`.

### 2) Frontend (recommended path)

```bash
cd frontend/social-agent-ai
npm install
npm run dev
```

### 3) Frontend (compatibility path)

If you're already inside `frontend/`, this now works too:

```bash
cd frontend
npm run dev
```

(If dependencies are not installed yet, run `npm run install:app` from `frontend/` first.)
