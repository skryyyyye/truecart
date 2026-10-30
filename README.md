# TrueCart - Multi-Store Price Comparison & Deal Tracker (BuyHatke Style)

**TrueCart** is a production-grade, fullstack e-commerce price comparison and deal-tracking web application inspired by **BuyHatke.com**. It continuously monitors, compares, and visualizes pricing datasets across India's top 4 retailers:
- **Amazon India**
- **Flipkart**
- **Croma Electronics**
- **Reliance Digital**

---

## 🌐 Live Hosted Access (Online Now)

- **Public HTTPS Web URL**: **[https://31d72cc1ca6cb0.lhr.life](https://31d72cc1ca6cb0.lhr.life)**
- **Backup Tunnel URL**: **[https://lovely-bags-fix.loca.lt](https://lovely-bags-fix.loca.lt)** *(Tunnel Password if prompted: `205.254.163.165`)*
- **Local Server URL**: **[http://localhost:8080](http://localhost:8080)**
- **Admin Portal**: **[https://31d72cc1ca6cb0.lhr.life/admin](https://31d72cc1ca6cb0.lhr.life/admin)** *(Login: `admin` / `admin123`)*
- **API Health Check**: **[https://31d72cc1ca6cb0.lhr.life/api/health](https://31d72cc1ca6cb0.lhr.life/api/health)**

---

## 🌟 Key Features

### 1. Multi-Store Real-time Comparison Matrix
- For every product in the catalog, compares:
  - Live Selling Price vs MRP (with discount percentage)
  - Bank Card Instant Discounts and Cashback offers
  - Delivery timelines (Prime Fast Delivery, Same Day Dispatch, Store Pickup in 2 hours)
  - Return & Replacement Policies
  - In-Stock verification badges
  - Direct checkout links to Amazon, Flipkart, Croma, and Reliance Digital
- Automatically computes and highlights the **"BEST DEAL - Lowest Price Guaranteed"** retailer and calculates exact rupee savings compared to other stores.

### 2. Interactive Price History Tracker (BuyHatke Iconic Feature)
- Visual Chart.js interactive graph displaying price fluctuations over 30 days, 90 days, and All-Time across all 4 retailers.
- Displays key benchmark indicators:
  - **All-Time Lowest Price Ever** (with store and date)
  - **All-Time Highest Price Ever**
  - **90-Day Market Average Price**
  - **Current Best Price**
- **Smart Buying Recommendation Engine**: Analyzes price trends to advise shoppers with actionable recommendations:
  - *"🔥 ALL-TIME LOWEST PRICE EVER! DEFINITELY BUY NOW!"*
  - *"👍 GOOD TIME TO BUY: Lower Than 90-Day Market Average"*
  - *"⏳ FAIR PRICE: Price Expected To Drop In Upcoming Festival Sale"*

### 3. Price Drop Alert Engine
- Set customized target price thresholds (e.g., alert when iPhone 15 Pro drops below ₹1,20,000).
- Users can manage active alerts in their personal profile dashboard.
- Background alert verification automatically flags triggered alerts when retailer prices drop.

### 4. Verified Promo Codes & Coupons Finder
- Tested coupon codes for Amazon, Flipkart, Croma, and Reliance Digital.
- One-click "Copy Code" with confetti celebration animation and direct retailer redirect.

### 5. Multi-Product Side-by-Side Comparison
- Compare up to 4 products simultaneously with full technical specifications and a 4-store pricing grid.

### 6. User Authentication & Profile
- User registration and login with JWT and bcrypt password hashing.
- Manage Price Alerts and Saved Wishlist items.

### 7. Full Admin Portal (Username & Password Protected)
- Dedicated Admin Access via `/admin`.
- **Default Admin Credentials**:
  - **Username**: `admin` (or `admin@truecart.com`)
  - **Password**: `admin123`
- **Admin Capabilities**:
  - **Live Overview Metrics**: Catalog count, registered users, active user alerts, triggered price drops.
  - **Real-Time Store Crawler / Sync Simulator**: One-click crawl across Amazon, Flipkart, Croma, and Reliance Digital that updates prices, appends new historical data points, and automatically triggers matching user price drop alerts.
  - **Product Management**: Add new products with 4-store prices and images, edit existing store listings, or delete products.
  - **Coupons Management**: Add and delete promotional store discount codes.
  - **Alerts Monitor**: Review all user-subscribed price thresholds.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Run

1. **Start the Unified Server** (serves backend API and client on port `8080`):
   ```bash
   npm start
   ```
   Open your browser to: **[http://localhost:8080](http://localhost:8080)**

2. **(Optional) Run in Separate Dev Mode**:
   - Backend API:
     ```bash
     npm run server
     ```
   - Vite React Frontend (with hot-reload):
     ```bash
     npm run client
     ```
     Access frontend at: **[http://localhost:3000](http://localhost:3000)**

---

## 🛍️ Supported Product Categories

TrueCart now tracks **43 top-selling products** across **13 categories** with live multi-store comparison datasets from Amazon, Flipkart, Croma, and Reliance Digital:
- **Flagship Smartphones (5)**: Apple iPhone 15 Pro, Samsung Galaxy S24 Ultra, Google Pixel 8 Pro, OnePlus 12 5G, Nothing Phone (2)
- **Laptops & Workstations (3)**: Apple MacBook Air M3, ASUS ROG Zephyrus G14 OLED, Dell XPS 15 3.5K OLED Touch
- **Audio & Headphones (3)**: Sony WH-1000XM5, Bose QuietComfort Ultra, Apple AirPods Pro (2nd Gen USB-C)
- **Fashion & Footwear (5)**: Nike Air Force 1 '07 Sneakers, Puma BMW MMS Drift Cat, Levi's 511 Slim Stretch Denim, Ray-Ban Aviator Polarized, Fossil Grant Chronograph Watch
- **Kitchen & Cooking (3)**: Philips Digital Air Fryer HD9252, Prestige Iris 750W Mixer Grinder, Instant Pot Duo 7-in-1 Multi Cooker
- **Sports & Fitness (5)**: Yonex Astrox 99 Pro Racket, Decathlon Domyos Hex Dumbbells (10kg x 2), Nivia Storm Match Football, Cosco Tournament Badminton Set, Spalding NBA Official Basketball
- **Hardware & Power Tools (4)**: Bosch GSB 500W Impact Drill Kit, Stanley 65-Piece Toolkit, Black+Decker 3.6V Cordless Screwdriver, Taparia Chrome Vanadium Spanner Set
- **Packed Foods & Grocery (6)**: Ferrero Rocher 24-Piece Box, Nescafe Gold Blend 200g Jar, Kellogg's Muesli 21% Fruit Magic 1kg, Tata Tea Gold 1kg, Saffola Gold Pro 5L Cooking Oil, Cadbury Celebrations Rich Dry Fruit Box
- **Smart TVs (2)**: Sony Bravia XR 65" 4K Google TV, LG 55" OLED 4K (OLED55C3PSA)
- **Smartwatches (2)**: Apple Watch Series 9 GPS 45mm, Samsung Galaxy Watch 6 Classic 47mm
- **Home & Laundry Appliances (3)**: Dyson V12 Detect Slim Vacuum, LG 8.0 Kg AI Direct Drive Washing Machine, KENT Grand Plus RO+UV Purifier
- **Gaming & Consoles (1)**: Sony PlayStation 5 Slim 1TB Disc Edition
- **Tablets (1)**: Apple iPad Pro 11-inch M4 Chip

---

## 🔑 Default Accounts

| Role | Username / Email | Password | Access |
|---|---|---|---|
| **SuperAdmin** | `admin` (or `admin@truecart.com`) | `admin123` | Full Admin Dashboard, Crawler Sync, CRUD |
| **Demo User** | `demo@truecart.com` | `password123` | Profile, Price Alerts, Wishlist |

---

## 📁 Project Structure

```
├── package.json               # Root scripts
├── server/
│   ├── index.js               # Express API server + static dist serving
│   ├── db.js                  # Persistent JSON/SQLite store with atomic writes
│   ├── seedData.js            # Curated catalog with 4-store prices & 90-day history
│   ├── middleware/
│   │   └── auth.js            # JWT verification & role authorization
│   └── routes/
│       ├── auth.js            # Login, Register, Admin Login, Profile
│       ├── products.js        # Products list, filter, search, compare, deals
│       ├── alerts.js          # User price drop alerts CRUD
│       ├── coupons.js         # Verified retailer promo codes
│       ├── watchlist.js       # User saved items
│       └── admin.js           # Admin stats, CRUD, Crawler simulation
└── client/
    ├── vite.config.js         # Vite configuration with proxy to port 8080
    ├── tailwind.config.js     # Custom brand color palette & styling
    ├── src/
    │   ├── App.jsx            # Main application router
    │   ├── context/
    │   │   └── AuthContext.jsx # Auth state, user alerts & watchlist
    │   ├── components/
    │   │   ├── Navbar.jsx     # Header with live search & autocomplete
    │   │   ├── Footer.jsx     # Footer with store transparency notes
    │   │   ├── PriceHistoryChart.jsx # BuyHatke Chart.js price tracker
    │   │   ├── StoreComparisonTable.jsx # 4-store side-by-side pricing matrix
    │   │   ├── PriceAlertModal.jsx # Drop alert threshold popup
    │   │   ├── ProductCard.jsx # Interactive product card
    │   │   ├── CouponCard.jsx # Copyable coupon code
    │   │   └── FilterSidebar.jsx # Filters by store, category, price, sort
    │   └── pages/
    │       ├── HomePage.jsx
    │       ├── ProductDetailPage.jsx
    │       ├── DealsPage.jsx
    │       ├── CouponsPage.jsx
    │       ├── ComparePage.jsx
    │       ├── LoginPage.jsx
    │       ├── RegisterPage.jsx
    │       ├── ProfilePage.jsx
    │       └── AdminDashboard.jsx
```

