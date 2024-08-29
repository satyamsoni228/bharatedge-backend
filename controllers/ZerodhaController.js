const axios = require('axios');
const ZerodhaAccount = require('../models/ZerodhaAccount');

const fetchAndStoreMargins = async () => {
  try {
    const accounts = await ZerodhaAccount.find();
    for (const account of accounts) {
      const response = await axios.post('http://localhost:5001/margins', { userid: account.userid });
      const { available, utilised } = response.data.equity;
      account.availableMargin = available.cash + available.collateral + available.adhoc_margin + available.intraday_payin;
      account.marginsUsed = utilised.debits + utilised.exposure + utilised.m2m_realised + utilised.m2m_unrealised + utilised.option_premium + utilised.payout + utilised.span + utilised.holding_sales + utilised.turnover + utilised.liquid_collateral + utilised.stock_collateral + utilised.equity + utilised.delivery;
      account.openingBalance = available.opening_balance;
      await account.save();
    }
  } catch (error) {
    console.error('Error fetching and storing margins:', error);
  }
};

exports.seleniumLogin = async (req, res) => {
  const { userid, password, twofa } = req.body;

  try {
    const response = await axios.post('http://localhost:5001/selenium_login', { userid, password, twofa });
    res.json(response.data);
  } catch (error) {
    console.error('Error performing Selenium login:', error);
    res.status(500).json({ message: 'Error performing Selenium login' });
  }
};

setInterval(fetchAndStoreMargins, 60 * 1000); // Fetch every 1 minute

exports.getAccounts = async (req, res) => {
  const { userId } = req.params;
  try {
    const accounts = await ZerodhaAccount.find({ userId });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAccount = async (req, res) => {
  const { userId, userid } = req.params;
  try {
    const account = await ZerodhaAccount.findOne({ userId, userid });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAccount = async (req, res) => {
  const { userId, userid, password, twofa } = req.body;
  const newAccount = new ZerodhaAccount({ userId, userid, password, twofa });
  try {
    const savedAccount = await newAccount.save();
    res.status(201).json(savedAccount);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAccount = async (req, res) => {
  const { userId, userid } = req.params;
  const { password, twofa } = req.body;
  try {
    const account = await ZerodhaAccount.findOne({ userId, userid });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    account.password = password;
    account.twofa = twofa;
    const updatedAccount = await account.save();
    res.json(updatedAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  const { userId, userid } = req.params;
  try {
    const account = await ZerodhaAccount.findOneAndDelete({ userId, userid });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.loginAccount = async (req, res) => {
  const { userid } = req.params;
  try {
    const account = await ZerodhaAccount.findOne({ userid });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    const response = await axios.post('http://localhost:5001/login', { userid: account.userid, password: account.password, twofa: account.twofa });
    account.enc_token = response.data.enctoken;
    await account.save();
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMargin = async (req, res) => {
  const { userid } = req.params;
  try {
    const account = await ZerodhaAccount.findOne({ userid });
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    if (!account.enc_token) {
      return res.status(401).json({ message: 'User not logged in' });
    }

    const response = await axios.post('http://localhost:5001/margins', { userid: account.userid });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getOrderMargin = async (req, res) => {
  const { userid, order_param_single } = req.body;

  try {
    const account = await ZerodhaAccount.findOne({ userid });
    if (!account) {
      console.error(`Account with userid ${userid} not found.`);
      return res.status(404).json({ message: 'Account not found' });
    }

    if (!account.enc_token) {
      console.error(`User ${userid} not logged in.`);
      return res.status(401).json({ message: 'User not logged in' });
    }

    // Log the order params for debugging
    console.log(`Fetching order margin with params:`, JSON.stringify(order_param_single));

    // Fetch the order margin using the given order parameters
    const response = await axios.post('http://localhost:5001/order_margins', {
      userid: account.userid,
      order_param_single
    });

    // Ensure the response is properly parsed and sent back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching order margin:', error.response?.data || error.message || error);
    res.status(500).json({ message: 'Error fetching order margin' });
  }
};


exports.getBasketMargin = async (req, res) => {
  const { userid, order_param_basket } = req.body;

  try {
    const account = await ZerodhaAccount.findOne({ userid });
    if (!account) {
      console.error(`Account with userid ${userid} not found.`);
      return res.status(404).json({ message: 'Account not found' });
    }

    if (!account.enc_token) {
      console.error(`User ${userid} not logged in.`);
      return res.status(401).json({ message: 'User not logged in' });
    }

    console.log(`Fetching basket margin with params:`, JSON.stringify(order_param_basket));

    const response = await axios.post('http://localhost:5001/basket_margins', {
      userid: account.userid,
      order_param_basket
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching basket margin:', error.response?.data || error.message || error);
    res.status(500).json({ message: 'Error fetching basket margin' });
  }
};