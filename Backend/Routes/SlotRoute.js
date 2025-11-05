// routes/slots.js
const express = require('express');
const router = express.Router();
const auth = require('../Middlewares/auth.js');
const Slot = require('../Models/Slot');

// create slot
router.post('/', auth, async (req, res) => {
  const { title,Description, startTime, endTime, status } = req.body;
  const slot = await Slot.create({
    title,Description, startTime, endTime, status: status || 'BUSY', owner: req.user._id
  });
  res.json(slot);
});

// read user's slots
router.get('/me', auth, async (req, res) => {
  const slots = await Slot.find({ owner: req.user._id }).sort({ startTime: 1 });
  res.json(slots);
});

// update slot (title, times, status) — ensure owner
router.put('/:id', auth, async (req, res) => {
  const slot = await Slot.findById(req.params.id);
  if (!slot) return res.status(404).json({ error: 'Not found' });
  if (!slot.owner.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
  const { title, startTime, endTime, status,Description } = req.body;
  if (title) slot.title = title;
  if (startTime) slot.startTime = startTime;
  if (endTime) slot.endTime = endTime;
  if (status) slot.status = status;
  if(Description) slot.Description = Description;
  await slot.save();
  res.json(slot);
});

// delete
router.delete('/:id', auth, async (req, res) => {
  const slot = await Slot.findById(req.params.id);
  if (!slot) return res.status(404).json({ error: 'Not found' });
  if (!slot.owner.equals(req.user._id)) return res.status(403).json({ error: 'Forbidden' });
  await slot.remove();
  res.json({ success: true });
});

module.exports = router;
