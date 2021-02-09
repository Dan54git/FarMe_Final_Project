var express = require('express');
var router = express.Router();

var { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products');
var { checkIfLogin, checkIfIsAdmin } = require('../../middlewares/authorization.js');

// Req used
router.get('/', getProducts);
router.get('/:productId', getProduct);

// Check tests
router.post('/', checkIfLogin, checkIfIsAdmin, createProduct);
router.patch('/:productId', checkIfLogin, checkIfIsAdmin, updateProduct);
router.delete('/:productId', checkIfLogin, checkIfIsAdmin, deleteProduct);

module.exports = router;
