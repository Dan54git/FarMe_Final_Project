var express = require('express');
var express = require('express');
var router = express.Router();

var { sendResetPassword, resetPassword } = require('../controllers/resetPassword');
const { resetPasswordValid } = require('../validates/resetPassword');

router.post('/', sendResetPassword);
router.patch('/reset', resetPasswordValid, resetPassword);

module.exports = router;
