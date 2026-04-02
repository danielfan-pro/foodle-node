# Foodle — Vite Frontend + Vercel API Functions

A React (Vite) app with Express-style API routes implemented as Vercel Functions in `api/index.js`.

## Local setup

```bash
npm install
```

Add environment variables in your shell or in Vercel project settings:

- `YELP_API_KEY`
- `SPOONACULAR_API_KEY`

## Run locally

### Frontend dev server (Vite)

```bash
npm run dev            # http://localhost:5173
```

Notes:
- The frontend proxies `/api` to `http://localhost:3001` (see `vite.config.js`).
- If no API is running on `3001`, search/detail API calls will fail locally.

### Full app via Vercel (frontend + API functions)

```bash
cd api && npm install && cd ..
npx vercel dev         # http://localhost:3000
```

## Environment variables

| Key | Description |
|-----|-------------|
| `YELP_API_KEY` | From https://fusion.yelp.com |
| `SPOONACULAR_API_KEY` | From https://spoonacular.com/food-api |

## API routes

### Restaurants (Yelp)
| Method | Path | Body |
|--------|------|------|
| GET | `/api/v1/restaurants/:id` | — |
| POST | `/api/v1/restaurants/search` | `{ location, item }` |

### Recipes (Spoonacular)
| Method | Path | Body |
|--------|------|------|
| POST | `/api/v1/recipes/search` | `{ item: "pasta" }` |
| GET | `/api/v1/recipes/:id` | — |

### Health
| Method | Path |
|--------|------|
| GET | `/api/health` |

## Deploy to Vercel

1. Push to GitHub
2. Import repo on https://vercel.com/new (Vercel can auto-detect **Vite**)
3. Add env vars: `YELP_API_KEY`, `SPOONACULAR_API_KEY`
4. Deploy (`vercel.json` rewrites `/api/*` to `api/index.js`)
