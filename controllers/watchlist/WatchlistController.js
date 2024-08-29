const mongoose = require('mongoose'); // Add this line to import mongoose
const WatchlistItem = require('../../models/WatchlistItem');

const addWatchlistItem = async (req, res) => {
    console.log('addWatchlistItem called with body:', req.body);
    try {
        const { watchlistId, instrument_token, userId } = req.body;
        const dateAdded = new Date();

        // Check if the item already exists in any watchlist for the same user
        const existingItem = await WatchlistItem.findOne({ instrument_token, userId });

        if (existingItem) {
            // Clone the item with the new watchlistId
            const clonedItem = new WatchlistItem({
                ...existingItem.toObject(),
                _id: mongoose.Types.ObjectId(), // Create a new ObjectId for the cloned item
                watchlistId: watchlistId, // Update the watchlistId
                dateAdded: dateAdded // Add dateAdded
            });

            await clonedItem.save();
            res.status(201).json({ success: true, payload: clonedItem });
        } else {
            // Create a new item if it doesn't exist
            const newItem = new WatchlistItem({
                ...req.body,
                dateAdded: dateAdded // Add dateAdded
            });
            await newItem.save();
            res.status(201).json({ success: true, payload: newItem });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


const removeWatchlistItem = async (req, res) => {
    try {
        const { watchlistId, instrument_token } = req.params;
        const deletedItem = await WatchlistItem.findOneAndDelete({ watchlistId, instrument_token });
        if (deletedItem) {
            res.status(200).json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'Item not found' });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const getWatchlistItems = async (req, res) => {
    try {
        const { watchlistId, userId } = req.params;
        const items = await WatchlistItem.find({ watchlistId, userId }).sort({ dateAdded: 1 });
        res.status(200).json({ success: true, payload: items });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


module.exports = {
    addWatchlistItem,
    removeWatchlistItem,
    getWatchlistItems
};




