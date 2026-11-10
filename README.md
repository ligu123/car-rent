# Car Rent
A small car-rental catalog split into two apps in an npm workspace:
- `apps/web` — Next.js frontend (React + TypeScript)
- `apps/api` — Express API that reads and changes cars in PostgreSQL (Neon)
Shared TypeScript types live in `packages/types/car.ts`. Both apps import that `Car` type.

The browser talks to Express. Express talks to Neon. Car records are not stored in frontend or API application files.

## Prerequisites
- Node.js (this repo uses npm workspaces)
- npm
- A Neon PostgreSQL database (free plan is enough)

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

## Neon setup
1. Create a Neon project and copy the Node.js connection string.
2. Copy the example env file and fill in the URL:

```bash
cp apps/api/.env.example apps/api/.env
```

Set `DATABASE_URL` in `apps/api/.env`. Do not commit `.env`. Placeholders are in `apps/api/.env.example`.

Express reads `DATABASE_URL` in `apps/api/src/db.ts` and connects with `ssl: "require"`. Connection setup stays in that file; routes stay in `apps/api/src/index.ts`.

## Create and populate the table
On a **fresh** database, run these files in the Neon SQL Editor (create first, then seed):

- `apps/api/sql/create-cars.sql` — creates the `cars` table
- `apps/api/sql/seed-cars.sql` — inserts the initial 34 cars (ids `"1"`–`"34"`)

Do not run the seed file on a database that already has those ids, or the inserts will fail on the primary key.

Express does not run these files on startup. Restarting the API does not reset Neon.

Image files stay in `apps/web/public`. The `image` column stores a path or URL as text.

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

Open http://localhost:3000 for the catalog. Manage cars at http://localhost:3000/managementpage.

The page loads cars from http://localhost:4000/cars. If the API is not running, the UI shows an error and a **Try again** button.

## Local configuration
- API listen port: `4000` in `apps/api/src/index.ts`
- CORS origin: `http://localhost:3000`
- Frontend fetch URL: `http://localhost:4000` (homepage and management page)
- Database: `DATABASE_URL` in `apps/api/.env`
- JSON body parser is enabled on the API (`express.json()`)

If you change the frontend port, update the CORS origin. If you change the API port, update the `fetch` URLs.

## API endpoints
Paths are on Express (`http://localhost:4000/...`), not under `/api`.

```bash
# Health
curl http://localhost:4000/health

# All cars
curl http://localhost:4000/cars

# Search and filter
curl "http://localhost:4000/cars?search=corolla"
curl "http://localhost:4000/cars?brand=Toyota"
curl "http://localhost:4000/cars?search=corolla&brand=Toyota"

# Brands for the homepage dropdown
curl http://localhost:4000/brands

# One car by id
curl http://localhost:4000/cars/1

# Missing id — 404
curl -i http://localhost:4000/cars/does-not-exist

# Create
curl -i http://localhost:4000/cars \
  -H "Content-Type: application/json" \
  -d '{"brand":"Toyota","model":"Prius","year":2024,"price":399,"image":"/cars/toyota-corolla-2020.jpg","image_alt":"Toyota Prius","description":"A test car."}'

# Partial update
curl -i -X PATCH http://localhost:4000/cars/1 \
  -H "Content-Type: application/json" \
  -d '{"price":300}'

# Delete
curl -i -X DELETE http://localhost:4000/cars/1

# Invalid body — 400
curl -i http://localhost:4000/cars \
  -H "Content-Type: application/json" \
  -d '{"brand":""}'
```

| Method | Path | Success | Error |
| --- | --- | --- | --- |
| `GET` | `/health` | `{ "ok": true }` | — |
| `GET` | `/cars` | `{ "cars": [ ... ] }` | `500` on database failure |
| `GET` | `/cars/:id` | `{ "status": "success", "car": { ... } }` | `404` |
| `GET` | `/brands` | `{ "brands": [ { "brand": "Toyota" }, ... ] }` | `500` |
| `POST` | `/cars` | `201` `{ "car": { ... } }` | `400` invalid body |
| `PATCH` | `/cars/:id` | `{ "status": "success", "car": { ... } }` | `400` / `404` |
| `DELETE` | `/cars/:id` | `{ "status": "success", "car": { ... } }` | `404` |

Search uses `ILIKE` on brand, model, and year. Brand is a case-insensitive match. No matches still return `200` and `{ "cars": [] }`. Results are ordered by `id`. Empty query values behave like no filter.

Create/edit JSON fields: `brand`, `model`, `year`, `price`, `image`, `image_alt`, `description`. Unexpected fields return `400`. `POST` generates the id on the server. `PATCH` only updates allowed fields.

## How to run the checks
- Neon SQL Editor: `SELECT COUNT(*) FROM cars;` and `SELECT * FROM cars WHERE id = '1';`
- curl list, search, brand, both filters, unknown id (404), create/edit/delete, invalid POST (400)
- Homepage: search, brand dropdown (options stay while searching), Clear, loading / empty / error + Try again
- Type quickly and confirm an older response does not replace a newer search
- Management page: create, edit, cancel delete, confirm delete; confirm the public page and Neon match
- Restart Express and confirm data did not reset
