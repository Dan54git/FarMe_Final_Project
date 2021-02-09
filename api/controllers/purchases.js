var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var { validationResult } = require('express-validator');
var Purchase = require('../models/purchases');
const session = require('express-session');

module.exports = {
    //Get purchase
    getPurchases: (req, res) => {
        var { userID } = req.query;

        if (userID != req.session.user._id) {
            return res.status(401).json({ message: 'You don\'t have access for this action' });
        }

        Purchase.find({ userID }).populate('cartItems.productID', '-type').then((purchases) => {
            res.status(200).json(purchases);
        }).catch((error) => {
            console.log('Error: Get purchases failed')
            console.log(error);
            res.status(500).json({ error: 'Get purchases failed' });
        });
    },
    getPurchaseById: (req, res) => {
        var purchaseID = req.params.purchaseID;
        Purchase.findOne({ _id: purchaseID }).populate('cartItems.productID', '-type').then((purchase) => {
            if (purchase.userID != req.session.user._id) {
                console.log('id not work', 29);
                return res.status(400).json({ message: 'You don\'t have access for this action' });
            }
            res.status(200).json(purchase);
        }).catch((error) => {
            console.log(`Get Purchase failed (Purchase: ${purchaseID})`);
            console.log(error);
            res.status(500).json({ error: `Get Purchase failed (Purchase: ${purchaseID})` });
        });
    },
    // Create new purchase
    createPurchase: (req, res) => {
        var { userID, deliveryDate, price, orderDetails, cartItems } = req.body;
        if (userID !== req.session.user._id) {
            return res.status(401).json({ message: 'You don\'t have access for this action' });
        }

        var validRes = validationResult(req);
        var errors = validRes.errors;
        if (errors.length !== 0) {
            console.log(`Error: Create purchase failed - invalid values`);
            console.log(errors);
            return res.status(409).json({ errors });
        }

        var purchase = new Purchase({
            _id: new mongoose.Types.ObjectId(),
            userID: new mongoose.Types.ObjectId(userID),
            orderDetails,
            deliveryDate,
            price,
            cartItems,
        });
        purchase.save().then((savesPurchase) => {
            res.status(201).json(savesPurchase);
        }).catch((error) => {
            console.error(error);
            console.log('Error: Purchase create failed - Save purchase failed');
            console.log(error);
            res.status(500).json({ message: 'Failed to create purchase' });
        });
    },
    // Delete purchase
    deletePurchase: (req, res) => {
        var _id = req.params.purchaseId;

        Purchase.findById(_id).then((purchase) => {
            if (purchase.userID != req.session.user._id) {
                return res.status(401).json({ message: 'You don\'t have access for this action' });
            }

            Purchase.deleteOne({ _id }).then(() => {
                res.status(200).json({ message: `purchase removed (Purchase: ${_id})` })
            }).catch((error) => {
                console.log(`Error: Delete purchase failed (Purchase: ${_id})`);
                console.log(error);
                res.status(500).json({ error: `Delete purchase failed (Purchase: ${_id})` });
            });
        }).catch(error => {
            console.log(`Error: Delete purchase failed (Purchase: ${_id})`);
            console.log(error);
            res.status(500).json({ error: `Delete purchase failed (Purchase: ${_id})` });
        });
    }
}
