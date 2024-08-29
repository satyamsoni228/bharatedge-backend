// models/ZerodhaHolding.js
const mongoose = require('mongoose');

const ZerodhaHoldingSchema = new mongoose.Schema({
  account_userid: { type: String, required: true },
  tradingsymbol: { type: String, required: true },
  exchange: { type: String, required: true },
  instrument_token: { type: Number, required: true },
  isin: { type: String, required: true },
  product: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  used_quantity: { type: Number, required: true },
  t1_quantity: { type: Number, required: true },
  realised_quantity: { type: Number, required: true },
  authorised_quantity: { type: Number, required: true },
  authorised_date: { type: Date, required: true },
  authorisation: { type: Object },
  opening_quantity: { type: Number, required: true },
  short_quantity: { type: Number, required: true },
  collateral_quantity: { type: Number, required: true },
  collateral_type: { type: String, required: true },
  discrepancy: { type: Boolean, required: true },
  average_price: { type: Number, required: true },
  last_price: { type: Number, required: true },
  close_price: { type: Number, required: true },
  pnl: { type: Number, required: true },
  day_change: { type: Number, required: true },
  day_change_percentage: { type: Number, required: true },
});

module.exports = mongoose.model('ZerodhaHolding', ZerodhaHoldingSchema);
