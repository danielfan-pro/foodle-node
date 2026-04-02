require('dotenv').config();

const express          = require('express');
const cors             = require('cors');
const restaurantRoutes = require('../src/routes/restaurants');
const recipeRoutes     = require('../src/routes/recipes');

const app = express();

// Allow all origins - no FRONTEND_ORIGIN needed
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log every incoming request so we can see what Vercel is sending
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/health',     (_req, res) => res.json({ status: 'ok' }));

app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/recipes',     recipeRoutes);

// Catch-all: show the actual path so we can debug
app.use((req, res) => res.status(404).json({ error: 'Not found', path: req.url, method: req.method }));

module.exports = app;
