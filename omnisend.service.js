/**
 * Omnisend REST API Service
 * Handles contacts, events, products, and product categories sync.
 * Docs: https://api.omnisend.com/doc/
 */
const axios = require('axios');

const BASE_URL = 'https://api.omnisend.com/v3';

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-API-KEY': process.env.OMNISEND_API_KEY
  };
}

// ─── Contacts ────────────────────────────────────────────────

async function createOrUpdateContact({ email, firstName, lastName, phone, tags }) {
  const identifiers = [{ type: 'email', id: email, channels: { email: { status: 'subscribed' } } }];
  if (phone) {
    identifiers.push({ type: 'phone', id: phone, channels: { sms: { status: 'nonSubscribed' } } });
  }
  const body = { identifiers };
  if (firstName) body.firstName = firstName;
  if (lastName) body.lastName = lastName;
  if (tags && tags.length) body.tags = tags;

  const res = await axios.post(`${BASE_URL}/contacts`, body, { headers: getHeaders() });
  return res.data;
}

async function getContact(email) {
  const res = await axios.get(`${BASE_URL}/contacts?email=${encodeURIComponent(email)}`, { headers: getHeaders() });
  return res.data;
}

// ─── Events ──────────────────────────────────────────────────

async function trackEvent({ email, eventName, fields }) {
  const body = {
    email,
    systemName: eventName,
    fields: fields || {}
  };
  const res = await axios.post(`${BASE_URL}/events`, body, { headers: getHeaders() });
  return res.data;
}

// ─── Products ────────────────────────────────────────────────

async function syncProduct(product) {
  // product should follow Omnisend product schema:
  // { productID, title, productUrl, imageUrl, price, currency, categoryIDs, variants, ... }
  const res = await axios.post(`${BASE_URL}/products`, product, { headers: getHeaders() });
  return res.data;
}

async function getProducts() {
  const res = await axios.get(`${BASE_URL}/products`, { headers: getHeaders() });
  return res.data;
}

async function getProduct(productID) {
  const res = await axios.get(`${BASE_URL}/products/${productID}`, { headers: getHeaders() });
  return res.data;
}

async function deleteProduct(productID) {
  const res = await axios.delete(`${BASE_URL}/products/${productID}`, { headers: getHeaders() });
  return res.data;
}

// ─── Product Categories ──────────────────────────────────────

async function syncCategory(category) {
  // category: { categoryID, title }
  const res = await axios.post(`${BASE_URL}/categories`, category, { headers: getHeaders() });
  return res.data;
}

async function getCategories() {
  const res = await axios.get(`${BASE_URL}/categories`, { headers: getHeaders() });
  return res.data;
}

async function deleteCategory(categoryID) {
  const res = await axios.delete(`${BASE_URL}/categories/${categoryID}`, { headers: getHeaders() });
  return res.data;
}

module.exports = {
  createOrUpdateContact,
  getContact,
  trackEvent,
  syncProduct,
  getProducts,
  getProduct,
  deleteProduct,
  syncCategory,
  getCategories,
  deleteCategory
};
