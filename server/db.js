const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { seedProducts, seedCoupons } = require('./seedData');

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db = {
  users: [],
  products: [],
  coupons: [],
  alerts: [],
  watchlist: [],
  lastCrawlTime: new Date().toISOString()
};

function initializeDb() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(content);
      // Ensure all seed products are synced
      if (!db.products || db.products.length === 0) {
        db.products = [...seedProducts];
      } else {
        const existingIds = new Set(db.products.map(p => p.id));
        seedProducts.forEach(sp => {
          if (!existingIds.has(sp.id)) {
            db.products.push(sp);
          }
        });
      }
      // Ensure all seed coupons are synced
      if (!db.coupons || db.coupons.length === 0) {
        db.coupons = [...seedCoupons];
      } else {
        const existingCoupIds = new Set(db.coupons.map(c => c.id));
        seedCoupons.forEach(sc => {
          if (!existingCoupIds.has(sc.id)) {
            db.coupons.push(sc);
          }
        });
      }
      if (!db.users || db.users.length === 0) {
        seedUsers();
      }
      saveDb();
      return;
    } catch (err) {
      console.error('Error reading db.json, creating new database:', err);
    }
  }

  // Initial fresh setup
  seedUsers();
  db.products = [...seedProducts];
  db.coupons = [...seedCoupons];
  db.alerts = [
    {
      id: "alert-demo-1",
      userId: "user-demo",
      productId: "prod-1",
      productTitle: "Apple iPhone 15 Pro (128 GB, Natural Titanium)",
      productImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      targetPrice: 120000,
      currentLowestPrice: 122999,
      store: "Flipkart",
      status: "active",
      createdAt: "2026-10-28T10:00:00.000Z"
    },
    {
      id: "alert-demo-2",
      userId: "user-demo",
      productId: "prod-5",
      productTitle: "Sony WH-1000XM5 Wireless Headphones",
      productImage: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
      targetPrice: 25000,
      currentLowestPrice: 24990,
      store: "Croma",
      status: "triggered",
      createdAt: "2026-10-25T14:30:00.000Z",
      triggeredAt: "2026-10-30T09:15:00.000Z"
    }
  ];
  db.watchlist = [
    {
      userId: "user-demo",
      productId: "prod-2"
    },
    {
      userId: "user-demo",
      productId: "prod-4"
    }
  ];
  db.lastCrawlTime = new Date().toISOString();
  saveDb();
}

function seedUsers() {
  const salt = bcrypt.genSaltSync(10);
  db.users = [
    {
      id: "admin-1",
      username: "admin",
      email: "admin@truecart.com",
      passwordHash: bcrypt.hashSync("admin123", salt),
      name: "TrueCart SuperAdmin",
      role: "admin",
      createdAt: new Date().toISOString()
    },
    {
      id: "user-kowshik",
      username: "kowshik",
      email: "kowshik@truecart.com",
      passwordHash: bcrypt.hashSync("password123", salt),
      name: "Kowshik Sake",
      role: "user",
      createdAt: new Date().toISOString()
    }
  ];
}

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save db.json:', err);
  }
}

// Compute lowest price and store across Amazon, Flipkart, Croma, Reliance Digital
function enrichProduct(product) {
  const storeKeys = ['amazon', 'flipkart', 'croma', 'reliance'];
  let minPrice = Infinity;
  let bestStore = 'amazon';

  storeKeys.forEach(k => {
    if (product.stores && product.stores[k] && product.stores[k].price) {
      if (product.stores[k].price < minPrice) {
        minPrice = product.stores[k].price;
        bestStore = k;
      }
    }
  });

  const lowestPrice = minPrice === Infinity ? product.mrp : minPrice;
  const highestPrice = Math.max(
    ...storeKeys.map(k => (product.stores && product.stores[k] ? product.stores[k].price : 0))
  );
  const totalSavings = (product.mrp || lowestPrice) - lowestPrice;
  const storeSavings = highestPrice - lowestPrice;

  return {
    ...product,
    currentLowestPrice: lowestPrice,
    bestStore: bestStore,
    totalSavingsVsMRP: totalSavings,
    savingsVsOtherStores: storeSavings > 0 ? storeSavings : 0
  };
}

// Products operations
function getProducts(filter = {}) {
  let list = db.products.map(enrichProduct);

  if (filter.category && filter.category !== 'All') {
    list = list.filter(p => p.category.toLowerCase() === filter.category.toLowerCase());
  }

  if (filter.brand && filter.brand !== 'All') {
    list = list.filter(p => p.brand.toLowerCase() === filter.brand.toLowerCase());
  }

  if (filter.search) {
    const q = filter.search.toLowerCase().trim();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (filter.store && filter.store !== 'all') {
    const s = filter.store.toLowerCase();
    list = list.filter(p => p.bestStore === s);
  }

  if (filter.minPrice) {
    list = list.filter(p => p.currentLowestPrice >= Number(filter.minPrice));
  }

  if (filter.maxPrice) {
    list = list.filter(p => p.currentLowestPrice <= Number(filter.maxPrice));
  }

  if (filter.sortBy) {
    if (filter.sortBy === 'price_asc') {
      list.sort((a, b) => a.currentLowestPrice - b.currentLowestPrice);
    } else if (filter.sortBy === 'price_desc') {
      list.sort((a, b) => b.currentLowestPrice - a.currentLowestPrice);
    } else if (filter.sortBy === 'savings_desc') {
      list.sort((a, b) => b.totalSavingsVsMRP - a.totalSavingsVsMRP);
    } else if (filter.sortBy === 'rating_desc') {
      list.sort((a, b) => b.rating - a.rating);
    }
  }

  return list;
}

function getProductById(id) {
  const p = db.products.find(item => item.id === id);
  return p ? enrichProduct(p) : null;
}

function addProduct(productData) {
  const id = `prod-${Date.now()}`;
  const now = new Date().toISOString().split('T')[0];

  const stores = productData.stores || {
    amazon: { storeName: "Amazon", logo: "amazon", price: productData.mrp, originalPrice: productData.mrp, discountPercent: 0, inStock: true, seller: "Amazon Prime", rating: 4.5, delivery: "Standard Delivery", url: "https://amazon.in" },
    flipkart: { storeName: "Flipkart", logo: "flipkart", price: productData.mrp, originalPrice: productData.mrp, discountPercent: 0, inStock: true, seller: "Flipkart Assured", rating: 4.5, delivery: "Standard Delivery", url: "https://flipkart.com" },
    croma: { storeName: "Croma", logo: "croma", price: productData.mrp, originalPrice: productData.mrp, discountPercent: 0, inStock: true, seller: "Croma Retail", rating: 4.5, delivery: "Store Delivery", url: "https://croma.com" },
    reliance: { storeName: "Reliance Digital", logo: "reliance", price: productData.mrp, originalPrice: productData.mrp, discountPercent: 0, inStock: true, seller: "Reliance ResQ", rating: 4.5, delivery: "Store Delivery", url: "https://reliancedigital.in" }
  };

  const prices = Object.values(stores).map(s => s.price);
  const minPrice = Math.min(...prices);

  const newProduct = {
    id,
    title: productData.title,
    brand: productData.brand || "General",
    category: productData.category || "Electronics",
    mrp: Number(productData.mrp),
    image: productData.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    gallery: productData.gallery || [productData.image],
    rating: Number(productData.rating) || 4.5,
    reviewsCount: Number(productData.reviewsCount) || 100,
    expertScore: Number(productData.expertScore) || 8.8,
    badge: productData.badge || "Newly Added",
    description: productData.description || "",
    specs: productData.specs || {},
    pros: productData.pros || ["Best in class price", "Verified store listings"],
    cons: productData.cons || ["Limited stock available"],
    stores,
    lowestPriceEver: { price: minPrice, store: "Amazon", date: now },
    highestPriceEver: { price: productData.mrp, store: "Flipkart", date: now },
    averagePrice: minPrice,
    priceDropNotice: "Newly tracked product on TrueCart!",
    priceHistory: [
      {
        date: now,
        amazon: stores.amazon.price,
        flipkart: stores.flipkart.price,
        croma: stores.croma.price,
        reliance: stores.reliance.price,
        lowest: minPrice
      }
    ]
  };

  db.products.unshift(newProduct);
  saveDb();
  return enrichProduct(newProduct);
}

function updateProduct(id, updates) {
  const idx = db.products.findIndex(p => p.id === id);
  if (idx === -1) return null;

  db.products[idx] = {
    ...db.products[idx],
    ...updates
  };
  saveDb();
  return enrichProduct(db.products[idx]);
}

function deleteProduct(id) {
  const initialLen = db.products.length;
  db.products = db.products.filter(p => p.id !== id);
  // Also clean up alerts & watchlist for this product
  db.alerts = db.alerts.filter(a => a.productId !== id);
  db.watchlist = db.watchlist.filter(w => w.productId !== id);
  saveDb();
  return db.products.length < initialLen;
}

// Scrape / Price Sync Engine Simulation (iconic BuyHatke crawler trigger)
function simulatePriceSync() {
  const storeKeys = ['amazon', 'flipkart', 'croma', 'reliance'];
  const today = new Date().toISOString().split('T')[0];
  let priceDropsDetected = 0;
  let triggeredAlertsCount = 0;

  db.products.forEach(product => {
    // Random subtle market movement (-3% to +2% shift on random store)
    const storeToUpdate = storeKeys[Math.floor(Math.random() * storeKeys.length)];
    const deltaPercent = (Math.floor(Math.random() * 11) - 6) / 100; // -6% to +4%
    const currentPrice = product.stores[storeToUpdate].price;
    const newPrice = Math.round(currentPrice * (1 + deltaPercent) / 10) * 10;

    if (newPrice !== currentPrice) {
      if (newPrice < currentPrice) priceDropsDetected++;
      product.stores[storeToUpdate].price = newPrice;
      product.stores[storeToUpdate].discountPercent = Math.max(
        0,
        Math.round(((product.mrp - newPrice) / product.mrp) * 100)
      );

      // Record in price history
      const currentLowest = Math.min(
        product.stores.amazon.price,
        product.stores.flipkart.price,
        product.stores.croma.price,
        product.stores.reliance.price
      );

      if (newPrice < product.lowestPriceEver.price) {
        product.lowestPriceEver = {
          price: newPrice,
          store: product.stores[storeToUpdate].storeName,
          date: today
        };
      }

      const existingTodayIndex = product.priceHistory.findIndex(h => h.date === today);
      const snapshot = {
        date: today,
        amazon: product.stores.amazon.price,
        flipkart: product.stores.flipkart.price,
        croma: product.stores.croma.price,
        reliance: product.stores.reliance.price,
        lowest: currentLowest
      };

      if (existingTodayIndex >= 0) {
        product.priceHistory[existingTodayIndex] = snapshot;
      } else {
        product.priceHistory.push(snapshot);
      }
    }
  });

  // Check alerts
  db.alerts.forEach(alert => {
    const prod = db.products.find(p => p.id === alert.productId);
    if (prod) {
      const enriched = enrichProduct(prod);
      alert.currentLowestPrice = enriched.currentLowestPrice;
      alert.store = enriched.bestStore;

      if (alert.status === 'active' && enriched.currentLowestPrice <= alert.targetPrice) {
        alert.status = 'triggered';
        alert.triggeredAt = new Date().toISOString();
        triggeredAlertsCount++;
      }
    }
  });

  db.lastCrawlTime = new Date().toISOString();
  saveDb();

  return {
    success: true,
    message: "Store crawler finished successfully! Scraped Amazon, Flipkart, Croma & Reliance Digital.",
    lastCrawlTime: db.lastCrawlTime,
    priceDropsDetected,
    triggeredAlertsCount
  };
}

// User operations
function findUserByEmailOrUsername(identifier) {
  if (!identifier) return null;
  const idLower = identifier.toLowerCase().trim();
  return db.users.find(u => 
    u.email.toLowerCase() === idLower || 
    (u.username && u.username.toLowerCase() === idLower) ||
    (idLower === 'demo@truecart.com' && (u.username === 'kowshik' || u.id === 'user-kowshik' || u.id === 'user-demo'))
  );
}

function findUserById(id) {
  return db.users.find(u => u.id === id);
}

function createUser({ name, email, username, password, role = 'user' }) {
  const salt = bcrypt.genSaltSync(10);
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email: email.toLowerCase().trim(),
    username: (username || email.split('@')[0]).toLowerCase().trim(),
    passwordHash: bcrypt.hashSync(password, salt),
    role,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb();
  return newUser;
}

// Alerts operations
function getAlerts(userId) {
  if (userId) {
    return db.alerts.filter(a => a.userId === userId);
  }
  return db.alerts;
}

function createAlert({ userId, productId, targetPrice }) {
  const prod = getProductById(productId);
  if (!prod) return null;

  const newAlert = {
    id: `alert-${Date.now()}`,
    userId,
    productId,
    productTitle: prod.title,
    productImage: prod.image,
    targetPrice: Number(targetPrice),
    currentLowestPrice: prod.currentLowestPrice,
    store: prod.bestStore,
    status: prod.currentLowestPrice <= Number(targetPrice) ? "triggered" : "active",
    createdAt: new Date().toISOString()
  };

  db.alerts.unshift(newAlert);
  saveDb();
  return newAlert;
}

function deleteAlert(alertId, userId) {
  const initialLen = db.alerts.length;
  db.alerts = db.alerts.filter(a => {
    if (userId) {
      return !(a.id === alertId && a.userId === userId);
    }
    return a.id !== alertId;
  });
  saveDb();
  return db.alerts.length < initialLen;
}

// Watchlist operations
function getWatchlist(userId) {
  const userItems = db.watchlist.filter(w => w.userId === userId);
  return userItems
    .map(w => getProductById(w.productId))
    .filter(Boolean);
}

function toggleWatchlist(userId, productId) {
  const exists = db.watchlist.some(w => w.userId === userId && w.productId === productId);
  if (exists) {
    db.watchlist = db.watchlist.filter(w => !(w.userId === userId && w.productId === productId));
    saveDb();
    return { inWatchlist: false };
  } else {
    db.watchlist.push({ userId, productId, addedAt: new Date().toISOString() });
    saveDb();
    return { inWatchlist: true };
  }
}

// Coupons operations
function getCoupons(store) {
  if (store && store !== 'all') {
    return db.coupons.filter(c => c.store.toLowerCase() === store.toLowerCase());
  }
  return db.coupons;
}

function addCoupon(couponData) {
  const newCoupon = {
    id: `coup-${Date.now()}`,
    store: couponData.store.toLowerCase(),
    code: couponData.code.toUpperCase(),
    title: couponData.title,
    minPurchase: Number(couponData.minPurchase) || 0,
    discountAmount: couponData.discountAmount,
    category: couponData.category || "All",
    verified: true,
    expiry: couponData.expiry || "2026-12-31",
    successRate: "98%"
  };
  db.coupons.unshift(newCoupon);
  saveDb();
  return newCoupon;
}

function deleteCoupon(id) {
  db.coupons = db.coupons.filter(c => c.id !== id);
  saveDb();
  return true;
}

// Admin stats
function getAdminStats() {
  const products = db.products.map(enrichProduct);
  const totalProducts = products.length;
  const totalUsers = db.users.length;
  const activeAlerts = db.alerts.filter(a => a.status === 'active').length;
  const triggeredAlerts = db.alerts.filter(a => a.status === 'triggered').length;
  const totalCoupons = db.coupons.length;

  const storeBreakdown = {
    amazon: products.filter(p => p.bestStore === 'amazon').length,
    flipkart: products.filter(p => p.bestStore === 'flipkart').length,
    croma: products.filter(p => p.bestStore === 'croma').length,
    reliance: products.filter(p => p.bestStore === 'reliance').length
  };

  const categories = [...new Set(products.map(p => p.category))];

  return {
    totalProducts,
    totalUsers,
    activeAlerts,
    triggeredAlerts,
    totalCoupons,
    storeBreakdown,
    categories,
    lastCrawlTime: db.lastCrawlTime
  };
}

initializeDb();

module.exports = {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  simulatePriceSync,
  findUserByEmailOrUsername,
  findUserById,
  createUser,
  getAlerts,
  createAlert,
  deleteAlert,
  getWatchlist,
  toggleWatchlist,
  getCoupons,
  addCoupon,
  deleteCoupon,
  getAdminStats
};

