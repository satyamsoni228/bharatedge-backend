const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PinnedInstrumentSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    pinnedInstruments: [
        {
            instrument_token: Number,
            underlying_instrument: String
        }
    ]
});

module.exports = mongoose.model('PinnedInstrument', PinnedInstrumentSchema);

