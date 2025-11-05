// routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  const { Firstname,Lastname, email, password } = req.body;
  if (!email || !password || !Firstname) return res.status(400).json({ error: 'Missing fields' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ Firstname,Lastname, email, passwordHash });
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.status(400).json({ error: 'Invalid creds' });
  const ok = await u.verifyPassword(password);
  if (!ok) return res.status(400).json({ error: 'Invalid creds' });
  const token = jwt.sign({ userId: u._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: u._id, name: u.name, email: u.email } });
});

module.exports = router;
