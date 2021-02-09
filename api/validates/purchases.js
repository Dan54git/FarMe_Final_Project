var { check } = require('express-validator');

var purchaseValid = [
    check('purchaseDate')
        .if(check('purchaseDate').exists())
        .isNumeric().withMessage('Invalid timestamp'),

    check('orderDetails.name.first')
        .exists({ checkFalsy: true }).withMessage('First name is require')
        .bail()
        .matches(/^[A-Za-z\s]+$/).withMessage('Invalid first name'),

    check('orderDetails.name.last')
        .exists({ checkFalsy: true }).withMessage('Last name is require')
        .bail()
        .matches(/^[A-Za-z\s]+$/).withMessage('Invalid last name'),

    check('orderDetails.address')
        .exists({ checkFalsy: true }).withMessage('Address date is require')
        .bail()
        .isString().withMessage('Invalid  address'),

    check('orderDetails.email')
        .exists({ checkFalsy: true }).withMessage('Email date is require')
        .bail()
        .isEmail()
        .normalizeEmail().withMessage('Invalid E-mail'),

    check('orderDetails.phone')
        .exists({ checkFalsy: true }).withMessage('Number phone is require')
        .bail()
        .matches(/^0[0-9]{8,9}$/).withMessage('Invalid number phone'),

    check('deliveryDate.date')
        .exists({ checkFalsy: true }).withMessage('Delivery date is require')
        .bail()
        .isNumeric().withMessage('Invalid timestamp'),

    check('deliveryDate.time')
        .exists({ checkFalsy: true }).withMessage('Delivery time is require')
        .bail()
        .isString().withMessage('Delivery time must be string'),

    check('price.deliveryPrice')
        .exists({ checkFalsy: true }).withMessage('Delivery price is require')
        .bail()
        .isNumeric().withMessage('Invalid delivery price'),

    check('price.totalPrice')
        .exists({ checkFalsy: true }).withMessage('Total price is require')
        .bail()
        .isNumeric().withMessage('Invalid total price'),

    check('price.itemsPrice')
        .exists({ checkFalsy: true }).withMessage('Items price is require')
        .bail()
        .isNumeric().withMessage('Invalid items price'),

    check('cartItems', 'Cart items is require')
        .exists({ checkFalsy: true })
];

module.exports = {
    purchaseValid,
}
