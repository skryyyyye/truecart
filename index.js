const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./server/routes/auth');
const productRoutes = require('./server/routes/products');
const alertRoutes = require('./server/routes/alerts');
const couponRoutes = require('./server/routes/coupons');
const watchlistRoutes = require('./server/routes/watchlist');
const adminRoutes = require('./server/routes/admin');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TrueCart API Server',
    storesTracked: ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital'],
    timestamp: new Date().toISOString()
  });
});

const clientDist = path.join(__dirname, 'client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('TrueCart API running. Run the client Vite dev server on port 3000.');
    }
  });
});

module.exports = app;
