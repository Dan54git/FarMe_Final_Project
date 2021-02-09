export var resetPassService = {
    sendResetPassLink,
    setNewPassword,
    getTokenFromURL,
}

var url = location.hostname === 'localhost'
    ? '//localhost:3000/api/resetpassword'
    : '/api/resetpassword';

async function sendResetPassLink(email) {
    try {
        var res = await axios.post(`${url}`, { email }); // connects the server - api/routes/resetPassword.js
        return res;
    } catch (error) {
        throw error.response;
    }
}

async function setNewPassword(data) {
    try {
        var res = await axios.patch(`${url}/reset`, data);
        return res;
    } catch (error) {
        throw error.response;
    }
}

function getTokenFromURL() {
    var urlPatch = window.location.pathname;
    var token = urlPatch.substring(urlPatch.lastIndexOf('/') + 1);
    return token;
}
