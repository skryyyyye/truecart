const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { getProducts, getProductById } = require('../db');

// Export products dataset as CSV
router.get('/export/csv', (req, res) => {
  try {
    const csvPath = path.join(__dirname, '../../truecart_products_dataset.csv');
    if (fs.existsSync(csvPath)) {
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="truecart_products_dataset.csv"');
      return res.sendFile(csvPath);
    }
    return res.status(404).json({ error: 'CSV file not found' });
  } catch (err) {
    console.error('CSV export error:', err);
    return res.status(500).json({ error: 'Failed to export CSV' });
  }
});

// List products with filtering & search
router.get('/', (req, res) => {
  try {
    const { category, brand, store, search, minPrice, maxPrice, sortBy } = req.query;
    const products = getProducts({
      category,
      brand,
      store,
      search,
      minPrice,
      maxPrice,
      sortBy
    });
    return res.json({
      count: products.length,
      products
    });
  } catch (err) {
    console.error('Fetch products error:', err);
    return res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Top Deals & Price Drops (BuyHatke Deals page)
router.get('/deals', (req, res) => {
  try {
    const products = getProducts();
    // Sort products having best discounts and active store savings
    const topDeals = [...products]
      .filter(p => p.totalSavingsVsMRP > 3000 || p.savingsVsOtherStores > 1000)
      .sort((a, b) => {
        const discountA = Math.round(((a.mrp - a.currentLowestPrice) / a.mrp) * 100);
        const discountB = Math.round(((b.mrp - b.currentLowestPrice) / b.mrp) * 100);
        return discountB - discountA;
      });

    return res.json({
      deals: topDeals
    });
  } catch (err) {
    console.error('Fetch deals error:', err);
    return res.status(500).json({ error: 'Failed to retrieve deals' });
  }
});

// Categories list with counts
router.get('/categories', (req, res) => {
  try {
    const products = getProducts();
    const catMap = {};
    products.forEach(p => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });

    const categories = Object.keys(catMap).map(name => ({
      name,
      count: catMap[name]
    }));

    return res.json({ categories });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

// Side-by-side comparison endpoint
router.get('/compare', (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ error: 'ids query param required (comma separated)' });
    }
    const idList = ids.split(',').map(s => s.trim());
    const products = idList.map(id => getProductById(id)).filter(Boolean);

    return res.json({ products });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to compare products' });
  }
});

// Single product details
router.get('/:id', (req, res) => {
  try {
    const product = getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Also get similar products from same category
    const related = getProducts({ category: product.category })
      .filter(p => p.id !== product.id)
      .slice(0, 4);

    return res.json({
      product,
      related
    });
  } catch (err) {
    console.error('Fetch product by ID error:', err);
    return res.status(500).json({ error: 'Failed to retrieve product details' });
  }
});

module.exports = router;

