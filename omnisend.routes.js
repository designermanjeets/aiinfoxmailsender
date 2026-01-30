/**
 * Omnisend REST API Routes
 * Mounted at /v1/omnisend
 */
const express = require('express');
const router = express.Router();
const omnisend = require('./omnisend.service');

// ─── Contacts ────────────────────────────────────────────────

// POST /v1/omnisend/contacts
router.post('/contacts', async (req, res) => {
  try {
    const { email, firstName, lastName, phone, tags } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }
    const data = await omnisend.createOrUpdateContact({ email, firstName, lastName, phone, tags });
    res.status(200).json({ data });
  } catch (err) {
    console.error('Omnisend createOrUpdateContact error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

// GET /v1/omnisend/contacts?email=...
router.get('/contacts', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'email query param is required' });
    }
    const data = await omnisend.getContact(email);
    res.status(200).json({ data });
  } catch (err) {
    console.error('Omnisend getContact error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

// ─── Events ──────────────────────────────────────────────────

// POST /v1/omnisend/events
router.post('/events', async (req, res) => {
  try {
    const { email, eventName, fields } = req.body;
    if (!email || !eventName) {
      return res.status(400).json({ error: 'email and eventName are required' });
    }
    const data = await omnisend.trackEvent({ email, eventName, fields });
    res.status(200).json({ data });
  } catch (err) {
    console.error('Omnisend trackEvent error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

// ─── Products ────────────────────────────────────────────────

// POST /v1/omnisend/products
router.post('/products', async (req, res) => {
  try {
    const data = await omnisend.syncProduct(req.body);
    res.status(200).json({ data });
  } catch (err) {
    console.error('Omnisend syncProduct error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

// GET /v1/omnisend/products
router.get('/products', async (req, res) => {
  try {
    const data = await omnisend.getProducts();
    res.status(200).json({ data });
  } catch (err) {
    console.error('Omnisend getProducts error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

// GET /v1/omnisend/products/:id
router.get('/products/:id', async (req, res) => {
  try {
    const data = await omnisend.getProduct(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    console.error('Omnisend getProduct error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

// DELETE /v1/omnisend/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    const data = await omnisend.deleteProduct(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    console.error('Omnisend deleteProduct error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

// ─── Product Categories ──────────────────────────────────────

// POST /v1/omnisend/categories
router.post('/categories', async (req, res) => {
  try {
    const data = await omnisend.syncCategory(req.body);
    res.status(200).json({ data });
  } catch (err) {
    console.error('Omnisend syncCategory error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

// GET /v1/omnisend/categories
router.get('/categories', async (req, res) => {
  try {
    const data = await omnisend.getCategories();
    res.status(200).json({ data });
  } catch (err) {
    console.error('Omnisend getCategories error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

// DELETE /v1/omnisend/categories/:id
router.delete('/categories/:id', async (req, res) => {
  try {
    const data = await omnisend.deleteCategory(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    console.error('Omnisend deleteCategory error:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;
