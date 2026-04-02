require('dotenv').config();

const express          = require('express');
const cors             = require('cors');
const restaurantRoutes = require('../src/routes/restaurants');
const recipeRoutes     = require('../src/routes/recipes');

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/restaurants', restaurantRoutes);
app.use('/api/v1/recipes',     recipeRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

module.exports = app;
