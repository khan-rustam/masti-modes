# Masti Mode Monorepo

This repository contains a Next.js frontend and an Express/MongoDB API server, configured as an npm workspaces monorepo and ready for deployment on Render.

## Apps
- frontend: Next.js 15 app (under `frontend/`)
- server: Express API (under `server/`)

## Quick start (local)
```bash
# install deps for all workspaces
npm install

# copy env examples and edit
cp .env.example .env
cp server/.env.example server/.env  # optional if you want separate files

# run both apps together
npm run dev
```

## Environment variables
See `.env.example` for root-level variables. The frontend expects `NEXT_PUBLIC_BASE_API` to point to the server URL. The server needs `MONGODB_URI` and `JWT_SECRET`.

## Seeding software data
```bash
# From the repo root
npm run seed:software
```
This reads `server/software-data.json`, maps categories to existing DB categories (see `server/category-map.json`), and upserts `Software` documents.

## Deploy on Render
Render configuration is provided in `render.yaml` with two services:
- masti-mode-server (Express API)
- masti-mode-frontend (Next.js web)

Frontend `NEXT_PUBLIC_BASE_API` is wired to the server's URL automatically via `fromService`.

## Scripts
- `npm run dev`: run server and frontend concurrently
- `npm run build`: build both
- `npm start`: start both (ensure proper env for production)
- `npm run seed:software`: seed data into MongoDB

## Notes
- Update `server/category-map.json` so your JSON categories map to your existing DB categories.
- Adjust CORS in `server/utils/env.js` via `CORS_ORIGINS`.


