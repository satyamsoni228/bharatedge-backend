const mongoose = require('mongoose');

const ZerodhaAccountSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userid: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  twofa: { type: String, required: true },
  availableMargin: { type: Number, default: 0 },
  marginsUsed: { type: Number, default: 0 },
  openingBalance: { type: Number, default: 0 },
  enc_token: { type: String }
});


module.exports = mongoose.model('ZerodhaAccount', ZerodhaAccountSchema);


