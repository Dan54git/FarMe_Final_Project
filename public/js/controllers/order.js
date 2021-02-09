import { getDayString, getDateString, formatPhoneNumber } from './../utils.js';
import { itemsCartService } from '../services/itemsCart.js';
import { purchaseService } from '../services/purchase.js';
import { userService } from '../services/user.js';

var user = userService.getUser();

var purchaseModel = {
    userID: user._id,
    orderDetails: {
        name: {
            first: user.firstName,
            last: user.lastName,
        },
        address: user.address,
        email: user.email,
        phone: user.phone,
    },
    deliveryDate: {
        date: null,
        time: null,
    },
    cartItems: [],
    price: {
        deliveryPrice: 10,
        itemsPrice: null,
        totalPrice: null
    },
}

var paymentModel = {
    cardNumber: null,
    expires: null,
    cvv: null,
    name: {
        first: null,
        last: null,
    },
}

var selectedBtnRadio = null;
var elSelectedBtnRadio = null;

var masks = {
    paymentDetails: {},
    orderDetails: {},
}

if (!userService.getUser()) {
    window.location.href = '/login';
}
$(window).on('load', () => {
    setListeners();
    renderDeliveryDateModal();
    setCloseableModal(false);
    showHideModal();
})

function setListeners() {
    // close modal button
    $('.btn-close-modal').click(showHideModal);
    
    // Edit Delivery-Details button
    $('.btn-details-edit').click(() => { openModal('deliveryDetails') });
    // Edit delivery-date button
    $('.edit-date-btn').click(() => { openModal('deliveryDate') });
    // Edit delivery-date button
    $('.edit-payment-details-btn').click(() => { openModal('payment') });
}

/* Modal renders */

// Delivery Date modal rendered
function renderDeliveryDateModal() {
    //One day in a milliseconds
    var dayMill = 1000 * 60 * 60 * 24; // 1000 = sec , 60 = min , 60 = hour , 24 = day (24 hours)

    //Current day in milliseconds
    var currDayMill = Date.now(); 

    // HTML string for render
    var HTMLstr = `
    <header class="modal-header">
        <h2>When do you want your delivery?</h2>
    </header>
    <main class="modal-main">
    <table class="delivery-table">
        `;

    // Create table rows 
    for (var i = 0; i < 7; i++) {
        var timeStamp = currDayMill + dayMill * i;
        var d = new Date(timeStamp);

        if (new Date(timeStamp).getDay() === 6) {  // If Saturday
            continue;
        }

        // Day and Date Format
        HTMLstr += `
        <tr>
            <td class="day">${getDayString(timeStamp).slice(0, 3)}</td> 
            <td class="date">${getDateString(timeStamp)}</td>`;

        // Sets morning order times
        // If is current day or sunday
        if (d.getDay() === 0 || i === 0) {
            HTMLstr += '<td></td>'
            // If friday
        } else if (d.getDay() === 5) {
            HTMLstr += `
            <td>
                <input type="radio" id="${timeStamp}-morning" name="date" data-date=${timeStamp} data-time="08:00-14:00" />
                <label class="radioLabel" for="${timeStamp}-morning">08:00-14:00</label>
            </td>`
        } else {
            HTMLstr += `
            <td>
                <input type="radio" id="${timeStamp}-morning" name="date" data-date=${timeStamp} data-time="08:00-17:00" />
                <label class="radioLabel" for="${timeStamp}-morning">08:00-17:00</label>
            </td>`
        }

        // // Sets evening order times
        // If is friday or if is current day and after 16:00 clock
        if (d.getDay() === 5 || (d.getDay() === new Date().getDay() && new Date().getHours() > 16)) {
            HTMLstr += '<td></td>';
        } else {
            HTMLstr += `
                <td>
                    <input type="radio" id="${timeStamp}-evening" name="date" data-date=${timeStamp} data-time="16:00-23:00" />
                    <label class="radioLabel" for="${timeStamp}-evening">16:00-23:00</label>
                </td>`
        }
        HTMLstr += '</tr>'
    }

    HTMLstr += `
        </table>
        </main>
        <footer class="modal-footer">
            <button class="btn-modal btn-ok" id="deliveryDateBtnOk">${selectedBtnRadio ? 'OK' : 'Next'}</button>
        </footer>`;

    // Render the model
    $('.modal-content').html(HTMLstr);

    if(!selectedBtnRadio){
            // Disables button 'next'
        $("#deliveryDateBtnOk").prop("disabled", true); // Next buuton will be availible after choosing date
    }

    // Add 'onClick' for each radio buttons
    $('.modal input[name=date]').each((idx, el) => {
        $(el).click(() => {
            if (purchaseModel.deliveryDate.date === null || purchaseModel.deliveryDate.time === null) {
                $('#deliveryDateBtnOk').prop('disabled', false);
            }
        });
        if (selectedBtnRadio) {
            var elDay = getDayString($(el).data('date'));
            var elTime = $(el).data('time');

            if (selectedBtnRadio.day === elDay && selectedBtnRadio.time === elTime) {
                $(el).prop('checked', true);
            }
        }
    });

    // On click OK/NEXT Button
    $('#deliveryDateBtnOk').click(() => {
        elSelectedBtnRadio = $('input[name=date]:checked'); 
        if (!selectedBtnRadio) {
            renderPaymentDetailsModal();
        } else {
            showHideModal();
        }
        saveDateDelivery();
        renderDateContent();
    });
}

// Payment Details modal rendered
function renderPaymentDetailsModal() {
    var htmlStr = `
    <header class="modal-header">
        <h2>Payment Details</h2>
    </header>
    <main>
        <form class="paymentDetails flex column" method="POST">

            <div class="form-element number-card flex column ">
                <label for="cardNumber">Credit Card Number</label>
                <input type="text" id="cardNumber" name="cardNumber" value="${paymentModel.cardNumber ? paymentModel.cardNumber : ''}" placeholder="xxxx xxxx xxxx xxxx"
                    maxlength="19" required />
                <p class="error-message" id="errorCardNumber"></p>
            </div>

            <div class="flex">
                <div class="form-element expires">
                    <label for="expires">Expires</label>
                    <input type="text" id="expires" name="expires" value="${paymentModel.expires ? paymentModel.expires : ''}" placeholder="mm/yy" maxlength="5" required />
                    <p class="error-message" id="errorExpires"></p>
                </div>
                <div class="form-element cvv">
                    <label for="cvv">CVV</label>
                    <input type="text" id="cvv" name="cvv" value="${paymentModel.cvv ? paymentModel.cvv : ''}" placeholder="000" maxlength="3" required />
                    <p class="error-message" id="errorCvv"></p>
                </div>
            </div>

            <div>
                <p>Card Holder Name</p>
                <div class="flex">
                    <div class="form-element first-name">
                        <label for="firstName">First name</label>
                        <input type="text" id="firstName" name="firstName" value="${paymentModel.name.first ? paymentModel.name.first : ''}" placeholder="First name" required />
                        <p class="error-message" id="errorFirstName"></p>
                    </div>
                    <div class="form-element last-name">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" name="lastName" value="${paymentModel.name.last ? paymentModel.name.last : ''}" placeholder="Last name" required />
                        <p class="error-message" id="errorLastName"></p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-modal paymentDetails-btn-ok" type="submit" id="btn-ok">OK</button>
            </div>
        </form>
    </main>`

    // Render the model
    $('.modal-content').html(htmlStr);

    $('.paymentDetails').submit('.paymentDetails-btn-ok', (ev) => {
        ev.preventDefault();
        if (paymentDetailsValidation()) {
            if (paymentModel.cardNumber) {
                savePaymentDetails();
                renderPaymentContent();
                showHideModal();
            } else {
                loadPageContent(ev);
            }
        }
    });

    masks.paymentDetails.cardNumber = IMask($('#cardNumber')[0], {
        mask: '0000 0000 0000 0000'
    });
    masks.paymentDetails.cvv = IMask($('#cvv')[0], {
        mask: '000',
    });
    masks.paymentDetails.expires = IMask($('#expires')[0], {
        mask: '00{/}00',
    });
}

// Delivery Details modal rendered
function renderOrderDetailsModal() {
    var { orderDetails } = purchaseModel;
    var htmlStr = `
    <header class="modal-header">
        <h2>Enter your delivery details</h2>
    </header>
    <main class="modal-main">
        <form class="delivery-details-form flex column" method="POST">
            <div class="flex">
                <div class="first-name form-element flex column">
                    <label for="firstName">First name</label>
                    <input type="text" id="firstName" name="firstName" placeholder="First name" value="${orderDetails.name.first}" required />
                    <p class="error-message" id="errorFirstName"></p>
                </div>
                <div class="form-element flex column">
                    <label for="lastName">Last name</label>
                    <input type="text" id="lastName" name="lastName"  placeholder="Last name" value="${orderDetails.name.last}" required />
                    <p class="error-message" id="errorLastName"></p>
                </div>
            </div>

            <div class="address flex column">
                <label for="address">Address</label>
                <input type="text" id="address" name="address" placeholder="Street, City, Apartment, Unit, etc" value="${orderDetails.address}" required />
                <p class="error-message" id="errorAddress"></p>
            </div>
            <div class="flex">
                <div class="email form-element flex column">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" placeholder="example@mail.com" value="${orderDetails.email}" required />
                    <p class="error-message" id="errorEmail"></p>
                </div>
                <div class="form-element flex column">
                    <label for="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" placeholder="(0)00-000-0000" value="${orderDetails.phone}" maxlength="12" required />
                    <p class="error-message" id="errorPhone"></p>
                </div>
            </div>
            <footer class="modal-footer">
                <button class="btn-modal btn-ok" type="submit" id="ok">OK</button>
            </footer>
        </form>
    </main>`

    $('.modal-content').html(htmlStr);

    masks.orderDetails.phone = IMask($('#phone')[0], {
        mask: [
            { mask: '00-000-0000' },
            { mask: '000-000-0000' }
        ]
    });

    $('.delivery-details-form').submit((ev) => {
        ev.preventDefault();
        if (orderDetailsValidation()) {
            onDeliveryDetailsModalBtn(ev);
        }
    });

}


function renderTankYouModal() {
    var htmlStr = ` 
    <main class="modal-main">
        <div class="thank-you-modal">
        <header class="modal-header">
            <p>Thank you for buying</p>
        </header>
            <main>
                <ul class="clean-list flex column">
                    <li>
                        <a href="/">Go to FraMe home page</a>
                    </li>
                    <li>
                        <a href="purchases/${purchaseModel._id}">Go to see your purchase</a>
                    </li>
                </ul>
            </main>
        </div>
    </main>`;

    $('.modal-content').html(htmlStr);
}

/* Contents renders after modals */

// Delivery Details Rendered 
function renderDeliveryContent() { 
    var phonFormat = formatPhoneNumber(purchaseModel.orderDetails.phone);
    var htmlStr = `
    <div class="row">
        <p class="name bold">${purchaseModel.orderDetails.name.first} ${purchaseModel.orderDetails.name.last}</p>
        <p class="phone bold">${phonFormat}</p>
    </div>
    <div class="row">
        <p>${purchaseModel.orderDetails.address}</p>
    </div>
    <div class="row">
        <p>${purchaseModel.orderDetails.email}</p>
    </div>`;

    $('.details-content').html(htmlStr);
}

// Delivery Date Rendered.  After the two modals the delivery date summery is rendered
function renderDateContent() { 
    var dayString = getDayString(purchaseModel.deliveryDate.date);
    var fullDateStr = getDateString(purchaseModel.deliveryDate.date) + '/' + new Date(purchaseModel.deliveryDate.date).getFullYear();
    var htmlStr = `
    <div class="row">
        <p>${purchaseModel.deliveryDate.time}</p>
        <p>${dayString}</p>
        <p>${fullDateStr}</p>
    </div>`;

    $('.date-content').html(htmlStr);
}

// Payment Details Rendered - after the models
function renderPaymentContent() { 
    var htmlStr = `
    <div class="row">
        <p class="card"><span class="bold">Number card:</span> ●●●●${paymentModel.cardNumber.slice(-4)}</p>
    </div>`;

    $('.payment-content').html(htmlStr);
}

// Delivery Items Rendered - after two modals
function renderItems() {  
    var rtHtmlStrs = purchaseModel.cartItems.map((cartItem) => {
        var item = cartItem.productID;
        return `
        <tr>
            <td>
                <div class="product-details">
                    <img src="./images/products/${item.img}" />
                    <p class="product-name">${item.name}</p>
                </div>
            </td>
            <td>
                <P>${item.price}₪<br>for package</P>
            </td>
            <td>
                <p class="units-count">${cartItem.units}</p>
            </td>
            <td>
                <p><span class="price-amount">${cartItem.units * item.price}</span>₪</p>
            </td>
        </tr>`
    });
    $('.items-table tbody').html(rtHtmlStrs);
}

// Order Summery Rendered
function renderOrderSummery() { 
    var items = purchaseModel.cartItems;
    var itemsPrice = calcItemsCartPrice(items);

    purchaseModel.price.itemsPrice = itemsPrice;
    purchaseModel.price.totalPrice = itemsPrice + purchaseModel.price.deliveryPrice;

    var htmlStr = `
        <h2 class="title">Order summery</h2>
        <div class="row row-summery">
            <p>Price:</p>
            <p class="total-price"><span class="amount">${itemsPrice.toFixed(2)}</span>₪</p>
        </div>
        <div class="row row-summery">
            <p>Delivery price:</p>
            <p class="delivery -price"><span class="amount">${purchaseModel.price.deliveryPrice}</span>₪</p>
        </div>
        <div class="row price-row">
            <p>Total Price:</p>
            <p class="total-price"><span class="amount">${(purchaseModel.price.totalPrice).toFixed(2)}</span>₪</p>
        </div>
        <div class="flex justify-content-center">
            <button class="btn-payment">Payment</button>
        </div>`;

    $('.summery.contain').html(htmlStr);

    $('.btn-payment').click(() => { onPaymentBtn(purchaseModel) });
}

// Saves selected delivery date from the modal
function saveDateDelivery() {
    // Save selected button
    selectedBtnRadio = {
        day: getDayString($(elSelectedBtnRadio).data('date')),
        time: $(elSelectedBtnRadio).data('time')
    }
    purchaseModel.deliveryDate.date = $(elSelectedBtnRadio).data('date');
    purchaseModel.deliveryDate.time = $(elSelectedBtnRadio).data('time');
}

// Saves payment details from the modal
function savePaymentDetails() {
    $('.paymentDetails input').each((idx, elForm) => {
        if (elForm.name === 'firstName') {
            paymentModel.name.first = elForm.value;
        } else if (elForm.name === 'lastName') {
            paymentModel.name.last = elForm.value;
        }
    });
    $.each(masks.paymentDetails, (key, mask) => {
        paymentModel[key] = mask.unmaskedValue;
    });
}

// Calls the renders functions after the payment modal
async function loadPageContent(ev) {
    savePaymentDetails();

    renderDeliveryContent();
    renderPaymentContent();
    purchaseModel.cartItems = await itemsCartService.loadItemsCart();
    renderItems();
    renderOrderSummery();

    showHideModal();
    setCloseableModal(true);
    $('.main-order').show();
}

// Saves and updates the data from the Delivery Details form-moadal
function onDeliveryDetailsModalBtn(ev) {
    $('.delivery-details-form input').each((idx, elForm) => {
        if (elForm.name === 'firstName') {
            purchaseModel.orderDetails.name.first = elForm.value;
        } else if (elForm.name === 'lastName') {
            purchaseModel.orderDetails.name.last = elForm.value;
        } else if (elForm.name !== 'phone') {
            purchaseModel.orderDetails[elForm.name] = elForm.value;
        }
    });
    purchaseModel.orderDetails.phone = masks.orderDetails.phone.unmaskedValue;
    renderDeliveryContent();
    showHideModal();
}

async function onPaymentBtn(purchase) {
    try {
        var newPurchase = await purchaseService.createPurchases(purchase);
        purchaseModel = newPurchase;
        renderTankYouModal();
        setCloseableModal(false);
        $('.main-order').hide();
        showHideModal();
        itemsCartService.deleteCartByUserID(purchaseModel.userID); // Empty the cart items/count for the user
    } catch (err) {
        console.error(err);
    }
}

/* Validations */

// Validation Delivery Details fields
function orderDetailsValidation() { 
    var firstName = $('.delivery-details-form #firstName').val();
    var lastName = $('.delivery-details-form #lastName').val();
    var email = $('.delivery-details-form #email').val();
    var phone = $('.delivery-details-form #phone').val();

    var isValid = true;

    // First name Validation
    if (!/^[A-Za-z\s]+$/.test(firstName)) {
        $('#errorFirstName').text('First name must be only with letters and spaces');
        $('.delivery-details-form #firstName').addClass('invalid');
        isValid = false;
    } else {
        $('#errorFirstName').text('');
        $('.delivery-details-form #firstName').removeClass('invalid');
    }
    // Last name Validation
    if (!/^[A-Za-z\s]+$/.test(lastName)) {
        $('#errorLastName').text('Last name must be only with letters and spaces');
        $('.delivery-details-form #lastName').addClass('invalid');
        isValid = false;
    } else {
        $('#errorLastName').text('');
        $('.delivery-details-form #lastName').removeClass('invalid');
    }
    // Email Validation
    if (!/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/.test(email)) {
        $('#errorEmail').text('Please enter a valid email for example: exmple@email.com');
        $('.delivery-details-form #email').addClass('invalid');
        isValid = false;
    } else {
        $('#errorEmail').text('');
        $('.delivery-details-form #email').removeClass('invalid');
    }
    // Phone Validation
    if (phone.length < 12) {
        $('#errorPhone').text('Please enter a valid phone for example: 000-000-0000');
        $('.delivery-details-form #phone').addClass('invalid');
        isValid = false;
    } else {
        $('#errorPhone').text('');
        $('.delivery-details-form #phone').removeClass('invalid');
    }
    return isValid;
}

// Payment Details validation
function paymentDetailsValidation() {
    var cardNumber = $('.paymentDetails #cardNumber').val();
    var firstName = $('.paymentDetails #firstName').val();
    var lastName = $('.paymentDetails #lastName').val();
    var expires = $('.paymentDetails #expires').val();
    var cvv = $('.paymentDetails #cvv').val();

    var isValid = true;

    // First name Validation
    if (!/^[A-Za-z\s]+$/.test(firstName)) {
        $('#errorFirstName').text('First name must be only with letters and spaces');
        $('.paymentDetails #firstName').addClass('invalid');
        isValid = false;
    } else {
        $('#errorFirstName').text('');
        $('.paymentDetails #firstName').removeClass('invalid');
    }
    // Last name Validation
    if (!/^[A-Za-z\s]+$/.test(lastName)) {
        $('#errorLastName').text('Last name must be only with letters and spaces');
        $('.paymentDetails #lastName').addClass('invalid');
        isValid = false;
    } else {
        $('#errorLastName').text('');
        $('.paymentDetails #lastName').removeClass('invalid');
    }
    // Curd number Validation
    if (cardNumber.length < 19) {
        $('#errorCardNumber').text('Please enter a valid card number');
        $('.paymentDetails #cardNumber').addClass('invalid');
        isValid = false;
    } else {
        $('#errorCardNumber').text('');
        $('.paymentDetails #cardNumber').removeClass('invalid');
    }
    // card expires Validation
    if (!/^(0[1-9]|1[0-2])\/([1-9]\d)$/.test(expires)) {
        $('#errorExpires').text('Please enter a valid date by format mm/yy');
        $('.paymentDetails #expires').addClass('invalid');
        isValid = false;
    } else {
        $('#errorExpires').text('');
        $('.paymentDetails #expires').removeClass('invalid');
    }
    // CVV Validation
    if (cvv.length < 3) {
        $('#errorCvv').text('CVV must have a three-digit');
        $('.paymentDetails #cvv').addClass('invalid');
    } else {
        $('#errorCvv').text('');
        $('.paymentDetails #cvv').removeClass('invalid');
    }
    return isValid;
}

// Gets string with modal name and open the modal 
function openModal(modalToRender) {
    switch (modalToRender) {
        case 'deliveryDate':
            renderDeliveryDateModal();
            break;

        case 'deliveryDetails':
            renderOrderDetailsModal();
            break;

        case 'payment':
            renderPaymentDetailsModal();
            break;
    }
    showHideModal();
}

// Hides/Show the model/screen
function showHideModal() {
    $('.modal').toggle();
    $('.screen').toggle();
}

function setCloseableModal(isCloseable = true) {
    if (isCloseable) {
        $('.contain-btn-close').show();
    } else {
        $('.contain-btn-close').hide();
    }
}

function calcItemsCartPrice(items) {
    var itemsPrice = 0;
    items.forEach((item) => {
        itemsPrice += item.units * item.productID.price;
    })
    return itemsPrice;
}
