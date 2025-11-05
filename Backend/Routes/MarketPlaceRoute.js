// routes/marketplace.js
const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/auth');
const Slot = require('../Models/Slot');

router.get('/swappable-slots', auth, async (req, res) => {
  const slots = await Slot.find({
    status: 'SWAPPABLE',
    owner: { $ne: req.user._id }
  }).populate('owner', 'name email');
  res.json(slots);
});

module.exports = router;
