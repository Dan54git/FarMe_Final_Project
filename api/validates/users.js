var { check } = require('express-validator');
var User = require('../models/users');

var signUpValid = [
    check('email')
        .isEmail() // if there is a @
        .normalizeEmail().withMessage('Invalid email') // if there is a .com
        .bail() // if one of them is not valid then stop
        .custom((email) => {
            return User.findOne({ email }).then((foundUser) => {  // checks if there is already a user with the same email address
                if (foundUser) return Promise.reject('Email already in use');
            })
        }),

    check('password', 'Password must be at least 8 characters long').isLength({ min: 8 }), // password min 8 characters long

    check('passconfrim', 'Passwords don\'t match')
        .custom((confirmPassword, { req }) => { return (confirmPassword === req.body.password) }),

    check('firstName', 'Invalid first name').isLength({ min: 2 }).matches(/^[A-Za-z\s]+$/),

    check('lastName', 'Invalid last name').isLength({ min: 2 }).matches(/^[A-Za-z\s]+$/),

    check('phone', 'Invalid number phone').matches(/^0[0-9]{8,9}$/),

    check('address', 'Invalid characters in your address').matches(/^[A-Za-z0-9\s,]+$/)
];


module.exports = {
    signUpValid
}
