/**
 * routes/recipes.js
 * Proxy to Spoonacular API — no database involved.
 *
 *   POST /api/v1/recipes/search  → search recipes
 *   GET  /api/v1/recipes/:id     → single recipe details
 */

const express = require('express');
const axios   = require('axios');

const router  = express.Router();
const API_KEY = () => process.env.SPOONACULAR_API_KEY;

// POST /api/v1/recipes/search
router.post('/search', async (req, res) => {
  const item = req.body.item || req.body.recipe?.item;

  try {
    const { data } = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: { apiKey: API_KEY(), query: item },
    });

    if (data?.results?.length > 0) {
      const shuffled = data.results.sort(() => 0.5 - Math.random()).slice(0, 4);
      return res.json({
        recipe_featured: shuffled[0],
        recipe_others:   shuffled.slice(1),
      });
    }
    return res.status(404).json({ error: 'No recipes found.' });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: 'Could not fetch recipes.' });
  }
});

// GET /api/v1/recipes/:id
router.get('/:id', async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.spoonacular.com/recipes/${req.params.id}/information`,
      { params: { apiKey: API_KEY() } }
    );
    return res.json({ recipe: data });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: 'Could not fetch recipe.' });
  }
});

module.exports = router;
