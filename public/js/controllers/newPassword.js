import { resetPassService } from '../services/resetPass.js';


$(window).on('load', async () => {
    $('.password-form').submit((ev) => { onsubmit(ev) });
})

async function onsubmit(ev) {
    try {
        ev.preventDefault();

        removeMsgsErr();

        var password = $('#password').val();
        var passConfirm = $('#passConfirm').val();
        var token = resetPassService.getTokenFromURL();

        var isValid = validPassword(password, passConfirm);
        if (isValid) {
            await resetPassService.setNewPassword({ password, passConfirm, token });
            resetPassSuccessed();
        }

    } catch (error) {
        console.error(error);
    }
}

function resetPassSuccessed() {
    var htmlSrt = `
    <div class="reset-pass-msg">
        <p>Your new password has been updated</p>
        <a href="/login">Click here to login</a>
    </div>`;
    $('.main-contain').html(htmlSrt);
}

function validPassword(password, passConfirm) {
    var isValid = true;
    if (password.length < 8) {
        $('#passErr').text('Password must be at least 8 characters long ')
        isValid = false;
    } else if (password !== passConfirm) {
        $('#passConfirmErr').text('Passwords not match');
        isValid = false;
    }
    return isValid;
}

function removeMsgsErr() {
    $('#passConfirmErr').text('');
    $('#passErr').text('')
}
