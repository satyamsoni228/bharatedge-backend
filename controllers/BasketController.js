const mongoose = require('mongoose');
const Basket = require('../models/Basket');
const Item = require('../models/Item');

exports.createBasket = async (req, res) => {
  try {
    const { name, userId } = req.body;
    const basket = new Basket({ name, userId });
    await basket.save();
    res.status(201).json(basket);
  } catch (error) {
    console.error('Error creating basket:', error);
    res.status(500).json({ message: 'Error creating basket', error });
  }
};

exports.addItemsToBasket = async (req, res) => {
  try {
    const { basketId, item } = req.body;

    if (!basketId || !item) {
      return res.status(400).json({ message: 'Basket ID and item data are required' });
    }

    const basket = await Basket.findById(basketId);
    if (!basket) {
      return res.status(404).json({ message: 'Basket not found' });
    }

    const newItem = new Item({ ...item, basket: basketId });
    await newItem.save();

    basket.items.push(newItem._id);
    await basket.save();

    res.status(200).json({ message: 'Item added successfully', item: newItem });
  } catch (error) {
    console.error('Error adding items to basket:', error);
    res.status(500).json({ message: 'Error adding items to basket', error });
  }
};

exports.getBaskets = async (req, res) => {
  try {
    const { userId } = req.params;
    const baskets = await Basket.find({ userId: mongoose.Types.ObjectId(userId) }).populate('items');
    res.status(200).json(baskets);
  } catch (error) {
    console.error('Error fetching baskets:', error);
    res.status(500).json({ message: 'Error fetching baskets', error });
  }
};

exports.updateBasketName = async (req, res) => {
  try {
    const { basketId, name } = req.body;
    await Basket.findByIdAndUpdate(basketId, { name });
    res.status(200).json({ message: 'Basket name updated successfully' });
  } catch (error) {
    console.error('Error updating basket name:', error);
    res.status(500).json({ message: 'Error updating basket name', error });
  }
};

exports.deleteBasket = async (req, res) => {
  try {
    const { basketId } = req.params;
    await Basket.findByIdAndDelete(basketId);
    res.status(200).json({ message: 'Basket deleted successfully' });
  } catch (error) {
    console.error('Error deleting basket:', error);
    res.status(500).json({ message: 'Error deleting basket', error });
  }
};

exports.updateBasketItem = async (req, res) => {
    try {
      const { basketId, item } = req.body;
  
      // First, ensure that the basket exists
      const basket = await Basket.findById(basketId);
      if (!basket) {
        return res.status(404).json({ message: 'Basket not found' });
      }
  
      // Now, update the corresponding item in the Item collection
      const updatedItem = await Item.findByIdAndUpdate(
        item._id,
        { $set: item },
        { new: true } // Return the updated item
      );
  
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      res.status(200).json({ message: 'Basket item updated successfully', updatedItem });
    } catch (error) {
      console.error('Error updating basket item:', error);
      res.status(500).json({ message: 'Error updating basket item', error });
    }
  };
  
  
  

exports.deleteBasketItem = async (req, res) => {
  try {
    const { basketId, itemId } = req.params;
    await Basket.findByIdAndUpdate(basketId, { $pull: { items: itemId } });
    await Item.findByIdAndDelete(itemId);
    res.status(200).json({ message: 'Basket item deleted successfully' });
  } catch (error) {
    console.error('Error deleting basket item:', error);
    res.status(500).json({ message: 'Error deleting basket item', error });
  }
};

exports.reorderItemsInBasket = async (req, res) => {
    try {
      const { basketId, items } = req.body;
  
      // Validate basket existence
      const basket = await Basket.findById(basketId);
      if (!basket) {
        return res.status(404).json({ message: 'Basket not found' });
      }
  
      // Update the items array in the basket
      basket.items = items.map(item => item._id); // Only store the item IDs
      await basket.save();
  
      res.status(200).json({ message: 'Basket items reordered successfully' });
    } catch (error) {
      console.error('Error reordering items in basket:', error);
      res.status(500).json({ message: 'Error reordering items in basket', error });
    }
  };
  
