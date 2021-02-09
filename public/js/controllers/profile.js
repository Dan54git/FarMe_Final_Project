import { userService } from '../services/user.js';

var user = userService.getUser();

$(window).on('load', () => {
    initializeDetailsForm();
    $('.details-form').submit((ev) => { onSave(ev) })

})

function initializeDetailsForm() { // Loads current user data to the inputs
    $('#firstName').val(user.firstName.trim());
    $('#lastName').val(user.lastName.trim());
    $('#cellNumber').val(user.phone.trim());
    $('#email').val(user.email.trim());
    $('#address').val(user.address.trim());
}

function onSave(ev) {
    ev.preventDefault();

    var isValid = validationFrom()

    if (isValid) { // If All the changes and updated are valid
        updateUserDetails()
    }
}

function validationFrom() { // Checks the validation of the fields
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var phone = $('#cellNumber').val();
    var email = $('#email').val();

    var isValid = true;

    // First name Validation
    if (!/^[A-Za-z]+$/.test(firstName)) {
        $('.err-firstName').text('First name must be only with letters');
        isValid = false
    }

    // Last name Validation
    if (!/^[A-Za-z]+$/.test(lastName)) {
        $('.err-lastName').text('Last name must be only with letters');
        isValid = false
    }

    // Phone Validation
    if (!/^0[0-9]{8,9}$/.test(phone)) {
        $('.err-cellNumber').text('Please enter a valid phone for example: 000-000-0000');
        isValid = false
    }

    // Email Validation
    if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email)) {
        $('.err-email').text('Please enter a valid email for example: exmple@email.com');
        isValid = false
    }

    return isValid;
}

async function updateUserDetails() { // Updates User details
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var phone = $('#cellNumber').val();
    var email = $('#email').val();
    var address = $('#address').val();

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.email = email;
    user.address = address;

    await userService.updateUser(user);
    window.location.href = '/';
}
