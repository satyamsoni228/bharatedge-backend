const mongoose = require('mongoose');

const WatchlistItemSchema = new mongoose.Schema({
  watchlistId: {
    type: Number,
    required: true,
  },
  instrument_token: {
    type: Number,
    required: true,
  },
  underlying_instrument: {
    type: String,
    required: false
  },
  underlying_token: {
    type: Number,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  tradingsymbol: {
    type: String,
    required: false
  },
  exchange: {
    type: String,
    required: false
  },
  segment: {
    type: String,
    required: false
  },
  instrument_type: {
    type: String,
    required: false
  },
  instrument_name: {
    type: String,
    required: false
  },
  exchange_token: {
    type: Number,
    required: false
  },
  expiry: {
    type: Date,
    required: false
  },
  strike: {
    type: Number,
    required: false
  },
  tick_size: {
    type: Number,
    required: false
  },
  lot_size: {
    type: Number,
    required: false
  },
  multiplier: {
    type: Number,
    required: false
  },
  is_non_fno: {
    type: Boolean,
    required: false
  },
  expiry_type: {
    type: String,
    required: false
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure unique combination of watchlistId, instrument_token, and userId
WatchlistItemSchema.index({ watchlistId: 1, instrument_token: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('WatchlistItem', WatchlistItemSchema);





