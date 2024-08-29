const axios = require('axios');
const PinnedInstrument = require('../models/PinnedInstrument');

const DEFAULT_PINNED_INSTRUMENTS = [
    { instrument_token: 256265, underlying_instrument: 'NIFTY' },
    { instrument_token: 265, underlying_instrument: 'SENSEX' }
];

module.exports.getPinnedInstruments = async (req, res) => {
    try {
        const userId = req.query.userId; // Assuming you pass userId as a query parameter
        let pinned = await PinnedInstrument.findOne({ user_id: userId });

        if (!pinned) {
            pinned = new PinnedInstrument({
                user_id: userId,
                pinnedInstruments: DEFAULT_PINNED_INSTRUMENTS
            });
            await pinned.save();
        }

        res.json({ success: true, payload: pinned.pinnedInstruments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.updatePinnedInstrument = async (req, res) => {
    try {
        const userId = req.body.userId; // Assuming you pass userId in the body
        const { index, instrument_token, underlying_instrument } = req.body;

        let pinned = await PinnedInstrument.findOne({ user_id: userId });

        if (!pinned) {
            pinned = new PinnedInstrument({
                user_id: userId,
                pinnedInstruments: DEFAULT_PINNED_INSTRUMENTS
            });
        }

        pinned.pinnedInstruments[index] = { instrument_token, underlying_instrument };
        await pinned.save();

        res.json({ success: true, payload: pinned.pinnedInstruments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



