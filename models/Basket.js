// File: backend/models/Basket.js

const mongoose = require('mongoose');

const basketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },  // Add userId field
  createdAt: { type: Date, default: Date.now }
});

const Basket = mongoose.model('Basket', basketSchema);
module.exports = Basket;

