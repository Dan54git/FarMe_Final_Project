var express = require('express');
var router = express.Router();

var { getItemsCart, addItemCart, updateItemCart, deleteItemCart, getItemsCartCount, deleteCart } = require('../controllers/itemsCart');
var { checkIfLogin } = require('../../middlewares/authorization.js');

router.get('/', checkIfLogin, getItemsCart);
router.get('/count', checkIfLogin, getItemsCartCount);
router.post('/', checkIfLogin, addItemCart);
router.patch('/:itemCartId', checkIfLogin, updateItemCart)
router.delete('/:itemCartId', checkIfLogin, deleteItemCart);
router.delete('/cart/:userID', checkIfLogin, deleteCart);

module.exports = router;
