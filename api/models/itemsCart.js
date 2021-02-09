var mongoose = require('mongoose');

var collectionName = 'itemsCart';

var itemCartSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
    productID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'product' },
    units: { type: Number, required: true }
}, { versionKey: false });

module.exports = {
    ItemCart: mongoose.model(collectionName, itemCartSchema, collectionName),
    itemCartSchema
}
