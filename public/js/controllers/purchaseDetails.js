import { getUrlIdParam, getDateString } from '../utils.js';
import { userService } from '../services/user.js';
import { purchaseService } from '../services/purchase.js';

var purchaseID = null;
var purchase = null;

$(window).on('load', async () => {
    purchaseID = getUrlIdParam();
    purchase = await purchaseService.getPurchaseById(purchaseID);
    pageRender()

    $('.btn-delete').click(onDelete);

    $('.main-contain').show();
})


function pageRender() {
    deliveryDetailsRender();
    itemsRender();
    summeryRender();
}

function deliveryDetailsRender() {
    var date = purchase.deliveryDate.date;
    var dateString = getDateString(date) + '/' + new Date(date).getFullYear();
    var htmlStr = `
    <tr>
        <td>${purchase.orderDetails.name.first} ${purchase.orderDetails.name.last}</td>
        <td>${purchase.orderDetails.address}</td>
        <td>${purchase.orderDetails.email}</td>
        <td>${purchase.orderDetails.phone}</td>
        <td>${dateString}</td>
    </tr>`;
    $('.delivery-details tbody').html(htmlStr);
}

function itemsRender() {
    var htmlStrs = purchase.cartItems.map((item) => {
        var { productID } = item;
        return `
        <tr>
            <td><img src="/images/products/${productID.img}" /></td>
            <td> ${productID.name} </td>
            <td> ${productID.price}₪ for package </td>
            <td> ${item.units} </td>
            <td> ${(item.units * productID.price).toFixed(2)}₪ </td>
        </tr>`
    });
    $('.items tbody').html(htmlStrs);
}

function summeryRender() {
    var htmlStr = `
    <tr>
        <td> ${purchase.price.deliveryPrice}₪ </td>
        <td> ${purchase.price.itemsPrice.toFixed(2)}₪ </td>
        <td><b>${purchase.price.totalPrice.toFixed(2)}₪</b></td>
    </tr>`;
    $('.summery tbody').html(htmlStr);
}

function onDelete() {
    purchaseService.deletePurchase(purchaseID);
    window.location.replace('/purchases');
}
