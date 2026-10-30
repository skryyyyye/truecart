const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const alertRoutes = require('./routes/alerts');
const couponRoutes = require('./routes/coupons');
const watchlistRoutes = require('./routes/watchlist');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'TrueCart API Server',
    storesTracked: ['Amazon', 'Flipkart', 'Croma', 'Reliance Digital'],
    timestamp: new Date().toISOString()
  });
});

// Serve client in production if built
const clientDist = path.join(__dirname, '../client/dist');
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

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  🛒 TrueCart API Server Live on http://localhost:${PORT}`);
  console.log(`  📊 Tracking: Amazon, Flipkart, Croma, Reliance Digital`);
  console.log(`  🔐 Admin Account: admin / admin123`);
  console.log(`  👤 Demo User: demo@truecart.com / password123`);
  console.log(`=========================================`);
});
