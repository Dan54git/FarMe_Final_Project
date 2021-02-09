import { resetPassService } from '../services/resetPass.js';


$(window).on('load', async () => {
    $('.resetPass-form').submit((ev) => { onsubmit(ev) });
})

async function onsubmit(ev) {
    try {
        ev.preventDefault(); // Stops the browser to make the post/get request, in order the js will do it.
        var email = $('input.email').val();
        await resetPassService.sendResetPassLink(email);
        sendingLinkSuccessed();

    } catch (error) {
        console.log({ errorStatus: error.status });
        if (error.status === 401) {
            var msgError = error.data.massage;
            $('.error-message').text(msgError);
        }
    }
}

function sendingLinkSuccessed() {
    var htmlSrt = `
    <div class="send-email-contain">
        <p>An email will be sent to you.</p>
        <p style="margin-bottom:15px;">Please follow the instructions in the email to create a new password for your account.</p>
    </div>`;
    $('.main-contain').html(htmlSrt);
}
