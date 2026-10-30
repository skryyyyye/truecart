const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getWatchlist, toggleWatchlist } = require('../db');

// Get user watchlist
router.get('/', authenticateToken, (req, res) => {
  try {
    const items = getWatchlist(req.user.id);
    return res.json({ watchlist: items });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve watchlist' });
  }
});

// Toggle product in watchlist
router.post('/toggle', authenticateToken, (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ error: 'productId is required' });
    }
    const result = toggleWatchlist(req.user.id, productId);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update watchlist' });
  }
});

module.exports = router;

