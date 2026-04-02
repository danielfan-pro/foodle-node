/**
 * services/yelpService.js
 *
 * Port of app/models/services/yelp_service.rb
 * Uses axios instead of the Ruby `http` gem.
 */

const axios = require('axios');

const API_HOST  = 'https://api.yelp.com';
const SEARCH_PATH   = '/v3/businesses/search';
const BUSINESS_PATH = '/v3/businesses/';
const SEARCH_LIMIT  = 20;

const API_KEY = process.env.YELP_API_KEY;

function authHeaders() {
  return { Authorization: `Bearer ${API_KEY}` };
}

/**
 * Search businesses by term and location.
 * Mirrors: YelpService.search(location, term)
 */
async function search(location = 'Boston, MA', term = 'pizza') {
  const response = await axios.get(`${API_HOST}${SEARCH_PATH}`, {
    headers: authHeaders(),
    params: { location, term, limit: SEARCH_LIMIT },
  });
  return response.data;
}

/**
 * Fetch a single business by Yelp ID.
 * Mirrors: YelpService.business(business_id)
 */
async function business(businessId) {
  const response = await axios.get(`${API_HOST}${BUSINESS_PATH}${businessId}`, {
    headers: authHeaders(),
  });
  return response.data;
}

module.exports = { search, business, API_KEY };
