const express = require('express')
const cors    = require('cors')
const axios   = require('axios')

const app = express()
app.use(cors())
app.use(express.json())

const YELP_KEY        = process.env.YELP_API_KEY
const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY

// ── Restaurants ──────────────────────────────────────────────────────────────

app.get('/api/v1/restaurants/:id', async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.yelp.com/v3/businesses/${req.params.id}`,
      { headers: { Authorization: `Bearer ${YELP_KEY}` } }
    )
    res.json({ restaurant: data })
  } catch (err) {
    res.status(502).json({ error: err.response?.data?.error?.description || 'Could not fetch restaurant.' })
  }
})

app.post('/api/v1/restaurants/search', async (req, res) => {
  const { location, item } = req.body.restaurant || req.body
  try {
    const { data } = await axios.get('https://api.yelp.com/v3/businesses/search', {
      headers: { Authorization: `Bearer ${YELP_KEY}` },
      params:  { location, term: item, limit: 20 }
    })
    const businesses = data.businesses || []
    if (!businesses.length) return res.status(404).json({ error: 'No restaurants found.' })
    const sampled = businesses.sort(() => 0.5 - Math.random()).slice(0, 4)
    res.json({ restaurant_featured: sampled[0], restaurant_others: sampled.slice(1) })
  } catch (err) {
    res.status(502).json({ error: err.response?.data?.error?.description || 'Search unavailable.' })
  }
})

// ── Recipes ──────────────────────────────────────────────────────────────────

app.post('/api/v1/recipes/search', async (req, res) => {
  const item = req.body.item || req.body.recipe?.item
  try {
    const { data } = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: { apiKey: SPOONACULAR_KEY, query: item }
    })
    if (!data?.results?.length) return res.status(404).json({ error: 'No recipes found.' })
    const shuffled = data.results.sort(() => 0.5 - Math.random()).slice(0, 4)
    res.json({ recipe_featured: shuffled[0], recipe_others: shuffled.slice(1) })
  } catch (err) {
    res.status(502).json({ error: 'Could not fetch recipes.' })
  }
})

app.get('/api/v1/recipes/:id', async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.spoonacular.com/recipes/${req.params.id}/information`,
      { params: { apiKey: SPOONACULAR_KEY } }
    )
    res.json({ recipe: data })
  } catch (err) {
    res.status(502).json({ error: 'Could not fetch recipe.' })
  }
})

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

module.exports = app
