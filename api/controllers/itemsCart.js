const session = require('express-session');
var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var { ItemCart } = require('../models/itemsCart');
var Product = require('../models/products');


module.exports = {
    // Get user items
    getItemsCart: (req, res) => {
        var userID = req.session.user._id;

        ItemCart.find({ userID })
            .populate('productID', '-type')
            .then((itemsCart) => {
                res.status(200).json(itemsCart);
            }).catch((error) => {
                console.log('Error: Get items cart failed')
                console.log(error)
                res.status(500).json({ error: 'Get items cart failed' });
            });
    },
    // Add item to cart
    addItemCart: (req, res) => {
        var { productID, units } = req.body;
        var userID = req.session.user._id;

        var item = {
            _id: new mongoose.Types.ObjectId(),
            userID,
            productID,
            units
        }

        var itemSchema = new ItemCart(item);
        itemSchema.save().then((itemCart) => {
            Product.findById(itemCart.productID).select('-type').then((product) => { // Finds the product
                itemCart.productID = product; // Adds the product to the itemCart
                res.status(201).json(itemCart);
            });
        }).catch((error) => {
            console.log('Error: Add item cart failed - item cart save failed')
            console.log(error)
            res.status(500).json({ error: `Add item cart failed Item-cart(${productID}` })
        });
    },
    // Update item-cart
    updateItemCart: (req, res) => {
        var _id = req.params.itemCartId;
        var ItemCartToUpdate = req.body;
        ItemCartToUpdate.productID = ItemCartToUpdate.productID._id;

        ItemCart.findById(_id).then((itemCart) => {
            if (itemCart.userID != req.session.user._id) {
                return res.status(401).json({ message: 'You don\'t have access for this action' });
            }

            ItemCart.findOneAndUpdate({ _id }, { 'units': ItemCartToUpdate.units }, { new: true })
                .then((updatedItem) => {
                    Product.findById(updatedItem.productID._id).select('-type').then((product) => {
                        updatedItem.productID = product;
                        res.status(201).json(updatedItem);
                    })
                }).catch((error) => {
                    console.log('Error: Item cart Update failed')
                    console.log(error)
                    res.status(500).json({ error: 'Item-cart update failed' });
                });

        }).catch((error) => {
            console.log('Error: Item cart Update failed')
            console.log(error)
            res.status(500).json({ error: 'Item-cart update failed' });
        });
    },

    // Remove item from cart
    deleteItemCart: (req, res) => {
        var itemId = req.params.itemCartId;
        ItemCart.findById(itemId).then((itemCart) => {
            if (itemCart.userID != req.session.user._id) {
                return res.status(401).json({ message: 'You don\'t have access for this action' });
            }

            ItemCart.deleteOne({ _id: itemId }).then(() => {
                res.status(200).json({ message: `Item deleted` })
            }).catch((error) => {
                console.log(`Error: Delete item failed (Item-cart: ${itemId})`)
                console.log(error)
                res.status(500).json({ error: `Delete item failed (Item-cart: ${itemId})` });
            })
        }).catch(error => {
            console.log(`Error: Delete item failed (Item-cart: ${itemId})`)
            console.log(error)
            res.status(500).json({ error: `Delete item failed (Item-cart: ${itemId})` });
        });
    },
    // Get count of items-cart
    getItemsCartCount: (req, res) => {
        var userID = req.session.user._id;
        ItemCart.countDocuments({ userID }).then(itemsCount => {
            res.status(200).json(itemsCount);
        }).catch((error) => {
            console.log('Error: Get items cart count failed');
            console.log(error);
            res.status(500).json({ error: 'Get items cart count failed' })
        })
    },
    // Delete cart (Delete the all items by user ID)
    deleteCart: (req, res) => {
        var userID = req.params.userID;

        if (userID != req.session.user._id) {
            return res.status(401).json({ message: 'You don\'t have access for this action' });
        }

        ItemCart.deleteMany({ userID }).then(() => {
            res.status(200).json({ message: `Cart deleted` })
        }).catch((error) => {
            console.log(`Error: Delete cart failed (UserID: ${userID})`)
            console.log(error)
            res.status(500).json({ error: `Delete cart failed (UserID: ${userID})` });
        })
    }
}
