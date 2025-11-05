// models/SwapRequest.js
const mongoose = require('mongoose');

const SwapRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // who initiated
  responder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // owner of desired slot
  mySlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true }, // requester's slot
  theirSlot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true }, // responder's slot
  status: {
    type: String,
    enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
    default: 'PENDING'
  }
}, { timestamps: true });

module.exports = mongoose.model('SwapRequest', SwapRequestSchema);
