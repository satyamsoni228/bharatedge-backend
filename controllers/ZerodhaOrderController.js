const axios = require('axios');
const ZerodhaOrder = require('../models/ZerodhaOrder');
const ZerodhaAccount = require('../models/ZerodhaAccount');

const fetchAndStoreOrders = async () => {
  try {
    const accounts = await ZerodhaAccount.find();
    for (const account of accounts) {
      if (!account.enc_token) continue;
      try {
        const response = await axios.post('http://localhost:5001/orders', { userid: account.userid });
        const orders = response.data;

        for (const order of orders) {
          await ZerodhaOrder.updateOne(
            { order_id: order.order_id },
            { $set: order },
            { upsert: true }
          );
        }
      } catch (error) {
        console.error(`Error fetching orders for account ${account.userid}:`, error);
      }
    }
  } catch (error) {
    console.error('Error fetching and storing orders:', error);
  }
};

const getOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await ZerodhaOrder.find({ account_id: userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOpenOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await ZerodhaOrder.find({ account_id: userId, status: 'OPEN' });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getExecutedOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await ZerodhaOrder.find({ account_id: userId, status: { $ne: 'OPEN' } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

setInterval(fetchAndStoreOrders, 1 * 1000); // Fetch every 1 minute

module.exports = {
  fetchAndStoreOrders,
  getOrders,
  getOpenOrders,
  getExecutedOrders,
};
