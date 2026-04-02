/**
 * routes/restaurants.js
 * Proxy to Yelp API — no database involved.
 *
 *   GET  /api/v1/restaurants/:id    → single business details
 *   POST /api/v1/restaurants/search → search businesses
 */

const express     = require('express');
const yelpService = require('../services/yelpService');

const router = express.Router();

// GET /api/v1/restaurants/:id
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await yelpService.business(req.params.id);
    return res.json({ restaurant });
  } catch (err) {
    console.error(err);
    const msg = err.response?.data?.error?.description || 'Could not fetch restaurant.';
    return res.status(502).json({ error: msg });
  }
});

// POST /api/v1/restaurants/search
router.post('/search', async (req, res) => {
  if (!process.env.YELP_API_KEY) {
    return res.status(503).json({ error: 'Yelp API key is missing.' });
  }

  const { location, item } = req.body.restaurant || req.body;

  try {
    const data       = await yelpService.search(location, item);
    const businesses = data.businesses;

    if (businesses && businesses.length > 0) {
      const sampled = businesses.sort(() => 0.5 - Math.random()).slice(0, 4);
      return res.json({
        restaurant_featured: sampled[0],
        restaurant_others:   sampled.slice(1),
      });
    } else if (data.error) {
      const msg = data.error.description || data.error.code || 'Search unavailable.';
      return res.status(502).json({ error: msg });
    } else {
      return res.status(404).json({ error: 'No restaurants found.' });
    }
  } catch (err) {
    console.error(err);
    const msg = err.response?.data?.error?.description || 'Search unavailable.';
    return res.status(502).json({ error: msg });
  }
});

module.exports = router;
