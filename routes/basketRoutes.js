const express = require('express');
const router = express.Router();
const BasketController = require('../controllers/BasketController');

router.post('/baskets', BasketController.createBasket);
router.post('/baskets/items', BasketController.addItemsToBasket);
router.get('/baskets/:userId', BasketController.getBaskets);
router.post('/baskets/update', BasketController.updateBasketName);
router.delete('/baskets/:basketId', BasketController.deleteBasket);
router.post('/baskets/items/update', BasketController.updateBasketItem);  // New route to update items
router.delete('/baskets/items/:basketId/:itemId', BasketController.deleteBasketItem);  // New route to delete item
router.post('/baskets/reorder-items', BasketController.reorderItemsInBasket);  // New route for reordering items


module.exports = router;



