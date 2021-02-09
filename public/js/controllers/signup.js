import { userService } from '../services/user.js';

var url = 'http://localhost:3000/api/user'

$(window).on('load', () => { 
    $('.signup-form').submit((ev) => { onSignUP(ev) })
})

async function onSignUP(ev) {
    try {
        ev.preventDefault(); // Stops the browser to make the post/get request, in order the js will do it.
        var signupForm = $('.signup-form').serialize(); // takes the inputs form to the signupForm
        var user = await userService.singUp(signupForm);
        window.location.href = '/'; // brings back the user to the home page
    } catch (err) {
        // Remove invalid class
        $('.signup-form input').addClass('valid'); // adds .valid class to the inpus elemnts
        $('.signup-form input').removeClass('invalid');

        var validationRes = err.response.data;
        validationRes.forEach((invalid) => {
            $('.' + invalid.param).removeClass('valid');
            $('.' + invalid.param).addClass('invalid'); // adds the .invalid calss to the error inputs ellemtns
        })
    }
    renderValidationMsg(validationRes);
}

function renderValidationMsg(validationRes) { // error messages above the form
    var htmlStrs = validationRes.map((valid) => {
        return `<p>${valid.msg}</p>`
    });
    $('.msgContain').html(htmlStrs);
}
