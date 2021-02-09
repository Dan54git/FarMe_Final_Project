var { check } = require('express-validator');

var resetPasswordValid = [
    check('token', 'Token is required').exists({ checkFalsy: true }).withMessage(),

    check('password').exists({ checkFalsy: true }).withMessage('Password is required').bail()
        .isLength({ minlength: 8 }).withMessage('Password must be at least 8 characters long'),

    check('passConfirm').exists({ checkFalsy: true }).withMessage('Confirm password is required')
        .bail()
        .custom((passConfirm, { req }) => {
            if (passConfirm !== req.body.password) {
                return Promise.reject('Passwords don\'t match');
            }
            return true;
        }),
];

module.exports = {
    resetPasswordValid
}
