# Foodle — Node.js Backend

A minimal Express API proxy for Yelp and Spoonacular. No database, no auth, fully Vercel-ready.

## Setup

```bash
npm install
cp .env.example .env   # add your API keys
npm run dev            # http://localhost:3000
```

## Environment variables

| Key | Description |
|-----|-------------|
| `YELP_API_KEY` | From https://fusion.yelp.com |
| `SPOONACULAR_API_KEY` | From https://spoonacular.com/food-api |
| `FRONTEND_ORIGIN` | Your frontend URL e.g. `https://foodle.vercel.app` |

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
2. Import repo on https://vercel.com/new → Framework: **Other**
3. Add env vars: `YELP_API_KEY`, `SPOONACULAR_API_KEY`, `FRONTEND_ORIGIN`
4. Deploy ✅
