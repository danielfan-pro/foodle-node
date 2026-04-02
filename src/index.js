/**
 * src/index.js
 *
 * Foodle — pure API proxy backend.
 * No database. No auth. Just Yelp + Spoonacular.
 * Fully Vercel-compatible.
 */

require('dotenv').config();

const express           = require('express');
const cors              = require('cors');
const restaurantRoutes  = require('./routes/restaurants');
const recipeRoutes      = require('./routes/recipes');

const app = express();

// ─── CORS ─────────────────────────────────────────────────────────────────────

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  'http://localhost:8080',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/recipes',     recipeRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// 404
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

// ─── Local dev ────────────────────────────────────────────────────────────────

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀  Foodle running at http://localhost:${PORT}`));
}

module.exports = app;
