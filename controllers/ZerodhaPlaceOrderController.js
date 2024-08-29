const axios = require('axios');

const placeOrder = async (req, res) => {
    const {
        accounts,
        variety,
        tradingsymbol,
        exchange,
        transaction_type,
        quantity,
        order_type,
        price,
        trigger_price,
        product,
        iceberg_legs,
        iceberg_quantity
    } = req.body;

    try {
        for (const account of accounts) {
            const payload = {
                userid: account,  // Pass the user ID directly
                variety,
                tradingsymbol,
                exchange,
                transaction_type,
                quantity,
                order_type,
                price,
                trigger_price,
                product,
                iceberg_legs,
                iceberg_quantity
            };

            const response = await axios.post('http://localhost:5001/place_order', payload);

            if (response.status === 200 && response.data && response.data.order_id) {
                console.log(`Order placed successfully for user ${account}. Order ID: ${response.data.order_id}`);
            } else {
                console.error(`Failed to place order for user ${account}`);
            }
        }

        res.status(200).json({ message: "Orders placed successfully" });
    } catch (error) {
        console.error('Error placing orders:', error);
        res.status(500).json({ message: "Error placing orders", error: error.message });
    }
};

module.exports = {
    placeOrder,
};
