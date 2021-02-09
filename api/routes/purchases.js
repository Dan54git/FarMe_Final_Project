var express = require('express');
var router = express.Router();

var { getPurchases, createPurchase, deletePurchase, getPurchaseById } = require('../controllers/purchases');
var { checkIfLogin } = require('../../middlewares/authorization.js');
var { purchaseValid } = require('../validates/purchases.js');


router.get('/', checkIfLogin, getPurchases);
router.get('/:purchaseID', checkIfLogin, getPurchaseById);
router.post('/', purchaseValid, checkIfLogin, createPurchase);
router.delete('/:purchaseId', checkIfLogin, deletePurchase);

module.exports = router;
