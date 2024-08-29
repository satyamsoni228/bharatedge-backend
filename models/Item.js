// File: backend/models/Item.js

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  exchange: { type: String, required: true },
  tradingsymbol: { type: String, required: true },
  transaction_type: { type: String, required: true },
  product: { type: String, required: true },
  order_type: { type: String, required: true, default: 'MARKET' },
  quantity: { type: Number, required: true },
  lots: { type: Number, required: true },
  price: { type: Number, required: false },
  trigger_price: { type: Number, required: false }, // Optional field
  accounts: [{ type: String, required: true }], // Array of account IDs
  variety: { type: String, required: true },
  iceberg_legs: { type: Number, required: false }, // Optional field
  iceberg_quantity: { type: Number, required: false } // Optional field
});

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
