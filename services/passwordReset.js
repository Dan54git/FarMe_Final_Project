var mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var path = require('path');
var User = require(path.resolve('api/models/users.js'));


async function tokenVerification(tokenID) {
    var isValid = true
    try {
        var user = await User.findOne({ tokenID }).then(res => res);
        if (user) {
            if (user.tokenEndTime < Date.now()) { // if tokenEndTime is grater than Date.now its possible to update password
                isValid = false;

                user.tokenID = undefined;
                user.tokenEndTime = undefined;
                user.save();
            }
        } else {
            isValid = false;
        }
        return isValid;
    } catch (error) {
        console.error(error);
        return false;
    }
}


module.exports = {
    tokenVerification,
}

