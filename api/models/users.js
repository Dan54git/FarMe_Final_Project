var mongoose = require('mongoose');

var collectionName = 'users';

var userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    isAdmin: { type: Boolean, default: false },
    firstName: { type: String, match: /^[A-Za-z\s]+$/, required: true },
    lastName: { type: String, match: /^[A-Za-z\s]+$/, required: true },
    phone: { type: String, match: /^0[0-9]{8,9}$/, required: true },
    address: { type: String, match: /^[A-Za-z0-9\s,]+$/, required: true },
    email: {
        type: String,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // w= for every word, 2-4= maximum reppetition
        lowercase: true,
        unique: true,
        required: true
    },
    password: { type: String, required: true },
    tokenID: { type: String, default: undefined }, // undefined = if the tokenID hadnt been created it will be undefinded
    tokenEndTime: { type: Number, default: undefined },
}, { versionKey: false });

module.exports = mongoose.model(collectionName, userSchema, collectionName); 
