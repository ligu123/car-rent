# Car Rent
A small car-rental catalog split into two apps in an npm workspace:
- `apps/web` — Next.js frontend (React + TypeScript)
- `apps/api` — Express API that serves the car list
Shared TypeScript types live in `packages/types/car.ts`. Both apps import that `Car` type.
## Prerequisites
- Node.js (this repo uses npm workspaces)
- npm
No `.env` file is required. Ports and the API URL are hardcoded for local development.
## Install dependencies
From the **repo root**. One install covers the web app, the API, and the root `concurrently` script:

```bash
git clone https://github.com/ligu123/car-rent.git
cd car-rent
npm install
```

To install one workspace at a time instead:
```bash
npm install -w web
npm install -w api
```
Or from each app folder:
```bash
cd apps/web && npm install
cd apps/api && npm install
```
## Start the apps
### Both at once (recommended)
From the repo root:
```bash
npm run dev
```
That runs:
- web: `npm run dev -w web` (Next.js)
- api: `npm run dev -w api` (`tsx watch src/index.ts`)
### Separately
```bash
# terminal 1 — frontend
npm run dev -w web
# terminal 2 — backend
npm run dev -w api
```
## Ports
| App | Folder | Command | Port | URL |
| --- | --- | --- | --- | --- |
| Frontend | `apps/web` | `next dev` | **3000** | http://localhost:3000 |
| Backend | `apps/api` | `tsx watch src/index.ts` | **4000** | http://localhost:4000 |
Open http://localhost:3000 for the catalog. The page loads cars from http://localhost:4000/cars. If the API is not running, the UI shows an error and a **Try again** button.
## Local configuration
Nothing to copy into `.env`. These values are in source:
- API listen port: `4000` in `apps/api/src/index.ts`
- CORS origin: `http://localhost:3000` (the Next.js origin)
- Frontend fetch URL: `http://localhost:4000/cars` in `apps/web/src/app/page.tsx`
- JSON body parser is enabled on the API (`express.json()`)
If you change the frontend port, update the CORS origin. If you change the API port, update the `fetch` URL.
Car records are in `apps/api/src/app/data/cars.ts` (in-memory, not a database). Image files are still served by the Next.js app under `apps/web/public`.
## Check the API endpoints
With the API running:
```bash
# Health
curl http://localhost:4000/health
# {"ok":true}
# Full car list
curl http://localhost:4000/cars
# One car by id
curl http://localhost:4000/cars/1
# Missing id — 404
curl -i http://localhost:4000/cars/999
```
| Method | Path | Success | Error |
| --- | --- | --- | --- |
| `GET` | `/health` | `{ "ok": true }` | — |
| `GET` | `/cars` | `{ "cars": [ ... ] }` | — |
| `GET` | `/cars/:id` | `{ "status": "success", "car": { ... } }` | `404` `{ "status": "error", "message": "Car with id … not found" }` |
You can also open those URLs in a browser.