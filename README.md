# QuoteRush MVP

QuoteRush is a MERN MVP for local service businesses to capture quote requests, manage leads, and automate follow-up communication.

## Tech Stack
- **Frontend:** React + Vite + Tailwind CSS + React Router + Axios
- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Auth:** JWT in `httpOnly` cookie
- **Tests:** Jest + Supertest (server), Vitest + Testing Library (client smoke)

## Project Structure
```
QuoteRush/
  client/
  server/
```

## Prerequisites
- Node.js 20+
- npm 10+
- MongoDB local or hosted URI

## Setup
1. Install dependencies
```bash
npm run install:all
```

2. Configure environment files
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Start development servers
```bash
npm run dev
```
If you suspect stale processes, use:
```bash
npm run dev:reset
```
- API: `http://localhost:5000`
- Frontend (default stable mode): `http://localhost:4173`
- Client default dev mode is websocket-free (stable mode), serves built assets, and proxies `/api` to `http://localhost:5000` to avoid browser CORS issues.

## Seed Demo Data
```bash
npm run seed
```
Demo login:
- Email: `demo@quoterush.app`
- Password: `DemoPass123!`

## Testing
Run all tests:
```bash
npm test
```
Or separately:
```bash
npm --prefix server test
npm --prefix client test -- --run
```

## API Base
`http://localhost:5000/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

### Leads (auth required)
- `POST /leads`
- `GET /leads`
- `GET /leads/:id`
- `PATCH /leads/:id`
- `DELETE /leads/:id`
- `POST /leads/:id/notes`

### Settings (auth required)
- `GET /settings`
- `PATCH /settings`

### Dashboard (auth required)
- `GET /dashboard`

### Public intake routes
- `GET /public/settings/:slug`
- `POST /public/quote/:slug`

## Automation Engine
- `AutomationJob` records are created on lead lifecycle events.
- Worker polls pending jobs on interval (`AUTOMATION_POLL_MS`).
- SMS/email adapters attempt real providers if credentials are present.
- Without credentials, sends are simulated and logged in `MessageLog`.


## Vite HMR WebSocket Troubleshooting
If your machine keeps failing Vite websocket (`[vite] failed to connect to websocket`), this repo now defaults to a websocket-free client dev flow on a different port than Vite HMR defaults.

Default (`npm run dev`):
- Runs one fresh `vite build`, then `vite build --watch` plus a local proxy server (`client/scripts/stable-proxy-server.cjs`)
- Kills stale local stable-mode processes before startup
- No HMR socket required
- API calls use same-origin `/api` and are proxied to backend
- Manual browser refresh after file changes

If you want normal HMR on a machine where websocket works:
```bash
npm --prefix client run dev:hmr
```

If you previously had stuck browser tabs, close old tabs and reopen `http://localhost:4173`, or run `npm run dev:reset` to clear stale server/client processes first.

Quick verification (should return nothing):
```bash
curl -s http://localhost:4173 | rg "@vite/client"
```

## Deployment Notes (Render/Railway)
- Deploy `server` as Web Service with `npm start`.
- Set environment variables from `server/.env.example`.
- Deploy `client` as Static Site with `npm run build` and publish `dist/`.
- Configure `VITE_API_URL` in client environment (default local is `/api` with stable proxy mode).
- API CORS currently reflects incoming request origins (`origin: true`) with credentials enabled; lock this down for production domains if needed.

## Manual QA Checklist
- Register and login.
- Create, edit, and delete leads.
- Add notes to a lead.
- Change status from `new` -> `quoted` -> `booked` -> `completed`.
- Verify `AutomationJob` and `MessageLog` records in database.
- Update settings and confirm persistence.
- Submit public quote intake form and verify lead appears in dashboard.

## Scripts
Root:
- `npm run install:all`
- `npm run dev`
- `npm run dev:reset`
- `npm test`
- `npm run seed`

Server:
- `npm run dev`
- `npm start`
- `npm run seed`
- `npm test`

Client:
- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm test`
