var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var { validationResult } = require('express-validator');
var User = require('../models/users');

module.exports = {
    // Get users
    getUsers: (req, res) => {
        User.find(req.query).select('-isAdmin -password').then((users) => {
            res.status(200).json(users);
        }).catch((error) => {
            console.log('Error: Get users failed');
            console.log(error);
            res.status(500).json({ error: 'Get users failed' })
        });
    },
    // Get one user
    getUser: (req, res) => {
        var _id = req.params.userId;
        User.findById({ _id }).select('-isAdmin -password').then((foundUser) => {
            res.status(200).json(foundUser);
        }).catch((error) => {
            console.log(`Error: Get user failed (User: ${_id})`);
            console.log(error);
            res.status(500).json({ message: `Get user failed (User: ${_id})` })
        });
    },
    // Create new user
    createUser: (req, res) => {
        var { firstName, lastName, phone, address, email, password } = req.body; // Array distruction

        var validRes = validationResult(req);
        var errors = validRes.errors;

        if (errors.length !== 0) {
            console.log(`Error: Create user failed - invalid values`);
            console.log(errors);
            res.status(401).json(errors); 
            return;
        }

        // Encrypt the password
        bcrypt.hash(password, 10, (error, hashPass) => {
            if (error) {
                console.log(`Error: Create user failed - Encrypt password failed`);
                console.log(error);
                return res.status(500).json({ error: 'Create user failed' })
            }

            password = hashPass;

            var user = new User({
                _id: new mongoose.Types.ObjectId(),
                firstName,
                lastName,
                phone,
                address,
                email,
                password
            });

            user.save().then((user) => {
                user.password = null; // For not saving the password in the sessionStorege
                req.session.user = user; // To save the new user to the session

                // New object for deleting the isAdmin,password fields. For not presenting the: "pas", "isAdmin" in the sessionStorage. 
                user = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    phone: user.phone,
                    address: user.address,
                    email: user.email,
                }
                res.status(200).json(user);
            }).catch((error) => {
                console.log(`Error: Create user failed - Save user failed`);
                console.log(error);
                res.status(500).json({ error: 'Failed to create user' }); // 500 Internal Server Error
            }); // End user.save function
        })
    },
    // Update user details 
    updateUser: (req, res) => {
        var userId = req.params.userId;
        var userToUpdate = req.body;

        if (userId != req.session.user._id) {  // Checks if the User that wants to update is the same user from the session
            return res.status(401).json({ message: 'You don\'t have access for this action' }) 
        }

        User.findOneAndUpdate({ _id: userId }, userToUpdate, { new: true }).select('-password -isAdmin')
            .then((userUpdated) => {
                res.status(200).json(userUpdated)
            }).catch(error => {
                console.log(`Error: Update user failed (User: ${userId})`);
                console.log(error);
                res.status(500).json({ error: 'User update failed' });
            })
    },
    // Remove user
    deleteUser: (req, res) => {
        var _id = req.params.userId
        User.remove({ _id }).then(() => {
            res.status(200).json({
                message: `User removed (User: ${userId})}`
            }).catch((error) => {
                console.log(`Error: User remove failed(User: ${userId})`);
                console.log(error);
                res.status(500).json({ error: `User remove failed (User: ${userId})` });
            });
        });
    },
    //Log in user
    login: (req, res) => {
        var { email, password } = req.body;
        if (!email) {
            console.log('Error: Email is required');
            res.status(401).json({ error: 'Email is required' })
            return;
        }

        if (!password) {
            console.log('Error: Password is required');
            res.status(401).json({ error: 'Password is required' })
            return;
        }

        User.findOne({ email }).then(foundUser => {
            if (!foundUser) {
                return res.status(401).json({ error: 'Incorrect email or password' }); 
            }

            bcrypt.compare(password, foundUser.password, (error, result) => {
                if (error) {
                    console.log(`Error: User login failed - Bcrypt compare failed`);
                    console.log(error);
                    return res.status(500).json({ error: 'Login failed' }); // 500 Internal Server Error
                }

                if (result) {
                    foundUser.password = null;
                    // Save foundUser details at session
                    req.session.user = foundUser;
                    // console.log(req.session.user);

                    // Copy foundUser without 'password' and 'isAdmin'
                    foundUser = {
                        _id: foundUser._id,
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName,
                        phone: foundUser.phone,
                        address: foundUser.address,
                        email: foundUser.email,
                        // password: foundUser.password,
                        // isAdmin: foundUser.isAdmin,
                    }
                    return res.status(200).json(foundUser)
                }

                // If is not equals
                res.status(401).json({ error: 'Incorrect email or password' });
            });
        });
    },
    // Log out user
    logout: (req, res) => {
        // Remove the session from server
        req.session.destroy();

        res.status(200).json({ message: 'User logged out successfully' })
    }
}
