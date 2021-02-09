var express = require('express');
var router = express.Router();
var User = require('../models/users');

var { getUsers, getUser, createUser, updateUser, deleteUser, login, logout } = require('../controllers/users');
var { checkIfLogin, checkIfIsAdmin } = require('../../middlewares/authorization.js');
var { signUpValid } = require('../validates/users.js');


router.get('/logout', checkIfLogin, logout);
router.post('/login', login);
router.post('/signup', signUpValid, createUser);
router.patch('/:userId', checkIfLogin, updateUser);
router.get('/:userId', checkIfLogin, getUser);


router.get('/', checkIfLogin, checkIfIsAdmin, getUsers);
router.delete('/:userId', checkIfLogin, checkIfIsAdmin, deleteUser);


module.exports = router;
