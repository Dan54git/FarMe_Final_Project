var bcrypt = require('bcrypt');
var mailgun = require("mailgun-js");
var { v4: uuidv4 } = require('uuid');
var { validationResult } = require('express-validator');

var User = require('../models/users');

// mailgun config
var api_key = process.env.API_KEY;
var Domain = process.env.DOMAIN;
var mg = mailgun({ apiKey: api_key, domain: Domain });


module.exports = {
    sendResetPassword: (req, res) => {
        var email = req.body.email
        if (!email) {
            return res.status(401).json({ massage: 'Email is required' })
        }

        User.findOne({ email }).then(user => {
            if (!user) {
                return res.status(401).json({ massage: 'Email not founded, please try agin' })
            }

            user.tokenID = uuidv4(); // Creats a temporery tokenID
            user.tokenEndTime = Date.now() + 1000 * 60 * 60 ; // The password will be valid for 1 hour

            user.save().then((userSaved) => {
                var resetPassLink = !process.env.PORT
                    ? `http://localhost:3000/resetpassword/reset/${user.tokenID}`
                    : `https://danb-farme-app.herokuapp.com/resetpassword/reset/${user.tokenID}` // Change to your server address
                var data = {
                    from: "FraMe <noreply@fraMe.com>",
                    subject: "FraMe",
                    to: email,
                    html: `
                        <h1 style="margin: 0 0 20px; color:green;">FarMe</h1>
                        <p style="margin: 0 0 10px;"><b>Hello,</b></p>
                        <p style="margin: 0 0 2px;">We received a request to reset your password at FarMe.</p>
                        <p style="margin: 0 0 10px;">If you want to reset your password, please click on the link</p>
                        <a href="${resetPassLink}">Reset password</a>` //Update the link to server domain
                };

                mg.messages().send(data, function (error, body) {
                    if (error) {
                        console.log('Sending email for reset password is failed ' + email);
                        console.log(error);
                        return res.status(500).json({ error: 'Reset password failed' })
                    }
                    res.status(200).json({ massage: 'Email for reset password sended' })
                })
            }).catch(err => {
                console.log('Reset password - save user failed');
                console.log(err);
                res.status(500).json({ error: 'Reset password failed' })
            });
        }).catch(err => {
            console.log('Reset password failed ' + email);
            console.log(err);
            res.status(500).json({ error: 'Reset password failed' })
        });
    },

    resetPassword: (req, res) => {
        var { password, token } = req.body;
        var validRes = validationResult(req);
        var errors = validRes.errors;
        if (errors.length !== 0) {
            console.log(`Error: Reset password failed - invalid values`);
            console.log(errors);
            return res.status(401).json(errors);
        }

        User.findOne({ tokenID: token }).then(user => {
            if (!user) {

                return res.status(401).json({ error: 'Token not founded in DB, please check and try again' });
            }

            if (user.tokenEndTime < Date.now()) {
                user.tokenID = undefined;
                user.tokenEndTime = undefined;
                user.save();
                return res.status(401).json({ error: 'This link has expired, please create a new one' });
            }

            bcrypt.hash(password, 10, (error, hashPass) => {
                if (error) {
                    console.log(`Error: Reset password failed - Encrypt password failed`);
                    console.log(error);
                    return res.status(500).json({ error: 'Reset password failed' })
                }

                user.password = hashPass;
                user.tokenID = undefined;
                user.tokenEndTime = undefined;

                user.save().then(userSaved => {
                    res.status(200).json({ massage: 'Password is rested successfully' });

                }).catch(error => {
                    console.log('Error: reset password failed - Update user failed');
                    console.log(error);
                    res.status(500).json({ error: 'Reset password failed' });
                });
            });
        }).catch(error => {
            console.log('Error: Reset password failed - Found user by tokenID failed');
            console.log(error);
            res.status(500).json({ error: 'Reset password failed' });
        });
    }

}


