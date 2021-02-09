
function checkIfLogin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(400).json({ massage: 'Please login for access this action' });
    }
    next();
}

function checkIfIsAdmin(req, res, next) {
    var user = req.session.user;
    if (!user.isAdmin) {
        return res.status(400).json({ message: 'You don\'t have access for this action' })
    }
    next();
}

module.exports = {
    checkIfLogin,
    checkIfIsAdmin,
} 
