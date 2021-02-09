var mongoose = require('mongoose');
var { itemCartSchema } = require('./itemsCart.js');

var collectionName = 'purchase';

var purchaseSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    purchaseDate: { type: Number, default: Date.now, required: true },
    orderDetails: {
        type: {
            name: {
                first: { type: String, match: /^[A-Za-z\s]+$/, required: true },
                last: { type: String, match: /^[A-Za-z\s]+$/, required: true },
            },
            address: { type: String, required: true },
            email: {
                type: String,
                match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                lowercase: true,
                required: true
            },
            phone: { type: String, match: /^0[0-9]{8,9}$/, required: true },
        }, required: true
    },
    deliveryDate: {
        type: {
            date: Number, required: true,
            time: String, required: true
        }, required: true
    },
    price: {
        type: {
            deliveryPrice: { type: Number, required: true },
            itemsPrice: { type: Number, required: true },
            totalPrice: { type: Number, required: true },
        }, required: true
    },
    cartItems: { type: [itemCartSchema], required: true }
}, { versionKey: false });

module.exports = mongoose.model(collectionName, purchaseSchema, collectionName);
