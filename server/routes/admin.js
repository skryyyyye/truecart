const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
  getAdminStats,
  addProduct,
  updateProduct,
  deleteProduct,
  simulatePriceSync,
  getAlerts,
  addCoupon,
  deleteCoupon
} = require('../db');

// Protect all admin routes
router.use(authenticateToken, requireAdmin);

// Admin dashboard statistics
router.get('/stats', (req, res) => {
  try {
    const stats = getAdminStats();
    return res.json(stats);
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ error: 'Failed to retrieve admin stats' });
  }
});

// Trigger crawler price sync across Amazon, Flipkart, Croma, Reliance Digital
router.post('/sync', (req, res) => {
  try {
    const result = simulatePriceSync();
    return res.json(result);
  } catch (err) {
    console.error('Crawler sync error:', err);
    return res.status(500).json({ error: 'Failed to run crawler sync' });
  }
});

// Create product
router.post('/products', (req, res) => {
  try {
    const { title, brand, category, mrp, image, description, stores, specs } = req.body;
    if (!title || !mrp) {
      return res.status(400).json({ error: 'Product title and MRP are required' });
    }

    const created = addProduct({
      title,
      brand,
      category,
      mrp,
      image,
      description,
      stores,
      specs
    });

    return res.status(201).json({
      message: 'Product added successfully to TrueCart catalog',
      product: created
    });
  } catch (err) {
    console.error('Add product error:', err);
    return res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product
router.put('/products/:id', (req, res) => {
  try {
    const updated = updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({
      message: 'Product updated successfully',
      product: updated
    });
  } catch (err) {
    console.error('Update product error:', err);
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/products/:id', (req, res) => {
  try {
    const success = deleteProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    return res.json({ message: 'Product deleted from TrueCart catalog' });
  } catch (err) {
    console.error('Delete product error:', err);
    return res.status(500).json({ error: 'Failed to delete product' });
  }
});

// View all user alerts
router.get('/alerts', (req, res) => {
  try {
    const alerts = getAlerts();
    return res.json({ alerts });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Add coupon
router.post('/coupons', (req, res) => {
  try {
    const { store, code, title, minPurchase, discountAmount, category, expiry } = req.body;
    if (!store || !code || !title) {
      return res.status(400).json({ error: 'Store, coupon code, and title are required' });
    }
    const coupon = addCoupon({ store, code, title, minPurchase, discountAmount, category, expiry });
    return res.status(201).json({ message: 'Coupon added successfully', coupon });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to add coupon' });
  }
});

// Delete coupon
router.delete('/coupons/:id', (req, res) => {
  try {
    deleteCoupon(req.params.id);
    return res.json({ message: 'Coupon deleted' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

module.exports = router;

