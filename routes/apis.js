var express = require('express');
var router = express.Router();
var path = require('path');

var productsApiRouters = require(path.resolve('api/routes/products'));
var usersApiRouters = require(path.resolve('api/routes/users'));
var itemCartApiRouters = require(path.resolve('api/routes/itemsCart'));
var purchasesApiRouters = require(path.resolve('api/routes/purchases'));
var restPasswordApiRouters = require(path.resolve('api/routes/resetPassword'));

//Products api
router.use('/product', productsApiRouters);

//Users api
router.use('/user', usersApiRouters);

//CartProducts api
router.use('/itemCart', itemCartApiRouters);

//Purchases api
router.use('/purchase', purchasesApiRouters);

// Rest Password api
router.use('/resetpassword', restPasswordApiRouters);

module.exports = router;
