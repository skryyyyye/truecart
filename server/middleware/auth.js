const jwt = require('jsonwebtoken');
const { findUserById } = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'truecart_super_secret_jwt_key_2026';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    const user = findUserById(userPayload.id);
    if (!user) {
      return res.status(404).json({ error: 'User no longer exists' });
    }
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  requireAdmin
};

