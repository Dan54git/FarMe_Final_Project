var mongoose = require('mongoose');

var collectionName = 'product';

var productSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true, toLowerCase:true },
    price: { type: Number, required: true },
    img: { type: String, default: 'nonImg.jpg' },
    type: { type: String, enum: ['fruit', 'vegetable'], required: true }
}, { versionKey: false });

module.exports = mongoose.model(collectionName, productSchema, collectionName);
