const { strict } = require('assert');
var express = require('express');
var router = express.Router();
var path = require('path');

var { getPurchaseById } = require(path.resolve('services/purchase.js'));
var { tokenVerification } = require(path.resolve('services/passwordReset.js'));

//Home page
router.get('',  (req, res) => {
    res.sendFile(path.resolve('public/views/home.html'));
});

//Store page
router.get('/store', (req, res) => {
    res.sendFile(path.resolve('public/views/store.html'));
});

//Cart page
router.get('/cart', (req, res) => {
    if (req.session && req.session.user) {
        res.sendFile(path.resolve('public/views/cart.html'));
    } else {
        res.sendFile(path.resolve('public/views/login.html'));
    }
});

//Profile page
router.get('/profile', (req, res) => {
    if (req.session && req.session.user) {
        res.sendFile(path.resolve('public/views/profile.html'));
    } else {
        res.sendFile(path.resolve('public/views/login.html'));
    }
});

//Signup page
router.get('/signup', (req, res) => {
    res.sendFile(path.resolve('public/views/signup.html'));
});

//Log-in page
router.get('/login', (req, res) => {
    res.sendFile(path.resolve('public/views/login.html'));
});

//PurchaseDetails page
router.get('/purchases/:purchaseID', async (req, res) => {
    if (req.session && req.session.user) {
        var purchaseID = req.params.purchaseID;
        var purchase = await getPurchaseById(purchaseID);
        if (purchase) {
            res.sendFile(path.resolve('public/views/purchaseDetails.html'));
        } else {
            res.sendFile(path.resolve('public/views/404NotFound.html'));
        }
    } else {
        res.sendFile(path.resolve('public/views/login.html'));
    }
});

//Purchases page
router.get('/purchases', (req, res) => {
    if (req.session && req.session.user) {
        res.sendFile(path.resolve('public/views/purchases.html'));
    } else {
        res.sendFile(path.resolve('public/views/login.html'));
    }
});

//About-us page
router.get('/about', (req, res) => {
    res.sendFile(path.resolve('public/views/about.html'));
});

// Order page
router.get('/order', (req, res) => {
    if (req.session && req.session.user) {
        res.sendFile(path.resolve('public/views/order.html'));
    } else {
        res.sendFile(path.resolve('public/views/login.html'));
    }
});

// set new password page
router.get('/resetpassword/reset/:id', async (req, res) => {
    var tokenID = req.params.id;
    var isValid = await tokenVerification(tokenID);
    if (isValid) {
        res.sendFile(path.resolve('public/views/newPassword.html'));
    } else {
        res.sendFile(path.resolve('public/views/resetPasswordExpired.html'));
    }
});

// Reset password page
router.get('/resetpassword', (req, res) => {
    res.sendFile(path.resolve('public/views/resetPassword.html'));
});

// IF all the prior get requests had not been found then 404 page
router.get('**', (req, res) => {
    res.sendFile(path.resolve('public/views/404NotFound.html'));
});

module.exports = router;
