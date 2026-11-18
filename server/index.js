const app = require('../index');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  TrueCart API Server Live on http://localhost:${PORT}`);
  console.log(`  Tracking: Amazon, Flipkart, Croma, Reliance Digital`);
  console.log(`=========================================`);
});

module.exports = app;
