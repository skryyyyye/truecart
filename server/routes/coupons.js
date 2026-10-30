const express = require('express');
const router = express.Router();
const { getCoupons } = require('../db');

// List coupons (optionally filter by store: amazon, flipkart, croma, reliance)
router.get('/', (req, res) => {
  try {
    const { store } = req.query;
    const coupons = getCoupons(store);
    return res.json({ coupons });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch coupons' });
  }
});

module.exports = router;

