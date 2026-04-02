const express = require('express')
const cors    = require('cors')
const axios   = require('axios')

const app = express()
app.use(cors())
app.use(express.json())

const YELP_KEY        = process.env.YELP_API_KEY
const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY

const extractBusinessUrlFromAi = (aiData, businessId) => {
  const entities = Array.isArray(aiData?.entities) ? aiData.entities : []

  for (const entity of entities) {
    const businesses = Array.isArray(entity?.businesses) ? entity.businesses : []
    for (const business of businesses) {
      if (business?.id !== businessId) continue
      const businessUrl = business?.attributes?.BusinessUrl
      if (businessUrl) return businessUrl
    }
  }

  return null
}

const getBusinessWebsiteFromAi = async (business) => {
  const queryParts = [business?.name, business?.location?.city, business?.location?.state]
    .filter(Boolean)
  if (!queryParts.length) return null

  const query = `What is the official website for ${queryParts.join(', ')}?`
  const user_context = {
    locale: 'en_US',
    latitude: business?.coordinates?.latitude ?? undefined,
    longitude: business?.coordinates?.longitude ?? undefined
  }

  const { data } = await axios.post(
    'https://api.yelp.com/ai/chat/v2',
    { query, user_context },
    { headers: { Authorization: `Bearer ${YELP_KEY}` } }
  )

  return extractBusinessUrlFromAi(data, business?.id) || null
}

// ── Restaurants ──────────────────────────────────────────────────────────────

app.get('/api/v1/restaurants/:id', async (req, res) => {
  try {
    const { data } = await axios.get(
      `https://api.yelp.com/v3/businesses/${req.params.id}`,
      { headers: { Authorization: `Bearer ${YELP_KEY}` } }
    )

    let businessWebsite = data?.attributes?.BusinessUrl || null
    if (!businessWebsite) {
      try {
        businessWebsite = await getBusinessWebsiteFromAi(data)
      } catch (_aiError) {
        businessWebsite = null
      }
    }

    res.json({
      restaurant: {
        ...data,
        business_website: businessWebsite
      }
    })
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
