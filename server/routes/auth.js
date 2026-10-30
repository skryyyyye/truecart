const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');
const { findUserByEmailOrUsername, createUser, getAlerts, getWatchlist } = require('../db');

// Register normal user
router.post('/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = findUserByEmailOrUsername(email);
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const user = createUser({
      name,
      email,
      password,
      role: 'user'
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login for normal user
router.post('/login', (req, res) => {
  try {
    const { identifier, email, username, password } = req.body;
    const loginKey = identifier || email || username;

    if (!loginKey || !password) {
      return res.status(400).json({ error: 'Username/email and password are required' });
    }

    const user = findUserByEmailOrUsername(loginKey);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const match = bcrypt.compareSync(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials. Wrong password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin login (specifically validates username/password and admin role)
router.post('/admin-login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Admin username and password are required' });
    }

    const user = findUserByEmailOrUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: You do not have administrator permissions.' });
    }

    const match = bcrypt.compareSync(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid admin credentials. Incorrect password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '2d' }
    );

    return res.json({
      message: 'Admin access authorized',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Current user profile check
router.get('/me', authenticateToken, (req, res) => {
  const alerts = getAlerts(req.user.id);
  const watchlist = getWatchlist(req.user.id);

  return res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      username: req.user.username,
      role: req.user.role,
      alertsCount: alerts.length,
      watchlistCount: watchlist.length
    }
  });
});

module.exports = router;

