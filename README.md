# Anish's Individual Chatting Site

[![Repo Size](https://img.shields.io/github/repo-size/Ram77-code/Anish-indivisual-chating-site)](https://github.com/Ram77-code/Anish-indivisual-chating-site)
[![Last Commit](https://img.shields.io/github/last-commit/Ram77-code/Anish-indivisual-chating-site/main)](https://github.com/Ram77-code/Anish-indivisual-chating-site/commits/main)

A mobile-first AI character chat app where you create personalities and have real conversations. It is a full-stack TypeScript project with a Vite React client and an Express API backed by PostgreSQL.

Key ideas
- Characters are first-class. Each one has a name, description, system prompt, and optional avatar.
- Conversations feel like a modern chat app. Smooth UI, quick actions, and responsive layout.
- Shared types across client and server with Zod + Drizzle to keep data consistent.

Quick start
1. Install Node.js 20 and PostgreSQL.
2. Set env vars (PowerShell):
```powershell
$env:DATABASE_URL="postgres://USER:PASS@HOST:5432/DBNAME"
$env:AI_INTEGRATIONS_OPENAI_API_KEY="sk-..."
$env:AI_INTEGRATIONS_OPENAI_BASE_URL="https://api.openai.com/v1"
```
3. Install and run:
```powershell
npm install
npm run db:push
npm run dev
```
4. Open the app at `http://localhost:5000` (dev server proxies Vite + API).

Live map of the stack
- `client/`: React + Vite + Tailwind + shadcn/ui
- `server/`: Express 5 API, OpenAI integration, storage layer
- `shared/`: Zod schemas and Drizzle models shared by both sides
- `script/build.ts`: Builds client + server into `dist/`

Core scripts
- `npm run dev`: Starts the full stack in development
- `npm run build`: Builds both client and server to `dist/`
- `npm run start`: Runs the production build
- `npm run db:push`: Pushes Drizzle schema to Postgres

Environment
- `DATABASE_URL`: PostgreSQL connection string
- `AI_INTEGRATIONS_OPENAI_API_KEY`: OpenAI API key
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: Optional custom base URL

Dynamic checks (copy/paste)
- Current branch: `git rev-parse --abbrev-ref HEAD`
- Last commit: `git log -1 --pretty=format:'%h - %s - %cr'`
- Uncommitted changes: `git status --porcelain`
- Tree snapshot: `git ls-tree --name-only HEAD`

Notes
- There is no auth yet. All data is shared globally.
- Keep secrets in your environment. Do not commit `.env` files.
- If you want production, add a host and secure authentication.

Contributing
1. Fork the repo.
2. Create a branch: `git checkout -b feat/short-description`
3. Commit with clear messages.
4. Open a PR to `main`.

Roadmap ideas
- Auth (per-user characters and conversations)
- Message streaming
- Image and audio tools in chat
- Per-character memory and summaries
- -----------********Thank you!!*****------------

