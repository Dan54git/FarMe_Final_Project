var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var path = require('path');
var Purchase = require(path.resolve('api/models/purchases.js'));

async function getPurchaseById(purchaseID) {
    try {
        var res = await Purchase.findOne({ _id: purchaseID }).then(purchase => purchase);
        return res;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = {
    getPurchaseById
}
