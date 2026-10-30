const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getAlerts, createAlert, deleteAlert } = require('../db');

// List current user's alerts
router.get('/', authenticateToken, (req, res) => {
  try {
    const alerts = getAlerts(req.user.id);
    return res.json({ alerts });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Create new price drop alert
router.post('/', authenticateToken, (req, res) => {
  try {
    const { productId, targetPrice } = req.body;
    if (!productId || !targetPrice) {
      return res.status(400).json({ error: 'Product ID and target price are required' });
    }

    const alert = createAlert({
      userId: req.user.id,
      productId,
      targetPrice: Number(targetPrice)
    });

    if (!alert) {
      return res.status(404).json({ error: 'Product not found' });
    }

    return res.status(201).json({
      message: 'Price drop alert created successfully! We will notify you when price drops.',
      alert
    });
  } catch (err) {
    console.error('Create alert error:', err);
    return res.status(500).json({ error: 'Failed to create price alert' });
  }
});

// Delete alert
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const success = deleteAlert(req.params.id, req.user.id);
    if (!success) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    return res.json({ message: 'Price alert removed successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete alert' });
  }
});

module.exports = router;

