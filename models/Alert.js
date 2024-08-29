const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  instrumentToken: { type: String, required: true },
  note: { type: String, required: true },
  conditionField: { type: String, required: true },
  conditionOperator: { type: String, required: true },
  conditionValue: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Added userId field
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
