import { userService } from '../services/user.js';

var validMsgs = [];

$(window).on('load', () => {
    $('.login-form').submit((ev) => { onLogin(ev) })
})

async function onLogin(ev) {
    ev.preventDefault(); // Stops the browser to make the post/get request, in order the js will do it.
    validMsgs = [];

    var password = $('.login-form .password').val();
    var email = $('.login-form .email').val();
    try {
        if (validation(email, password)) {
            var user = await userService.login({ email, password });
            userService.saveUser(user);
            window.location.href = '/'; 
        }
    } catch (err) {
        validMsgs.push('Incorrect email or password');
        $('.password').addClass('invalid');
        $('.email').addClass('invalid');
    } finally {
        if (validMsgs.length > 0) {
            renderValidationMsg(validMsgs)
        }
    }
}


function validation(email, password) { // checks validation of the email
    var isValid = true;
    // Invalid email
    if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email)) {
        validMsgs.push('Please enter a valid email');
        $('.email').addClass('invalid');
        isValid = false;
    }
    return isValid;
}

function renderValidationMsg(validMsgs) { // display an error message
    var htmlStrs = validMsgs.map((validMsg) => {
        return `<p>${validMsg}</p>`
    });
    $('.msgContain').html(htmlStrs);
}


