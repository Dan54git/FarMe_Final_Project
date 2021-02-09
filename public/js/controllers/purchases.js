import { purchaseService } from '../services/purchase.js';
import { userService } from '../services/user.js';
import { getDateString } from '../utils.js';

var userID = userService.getUser()._id;
var purchases;

$(window).on('load', async () => {
    purchases = await purchaseService.getPurchasesByUserID(userID); // Gets all the purchases of the user
    console.log({ purchases });
    renderPurchases();


    // To delete a purchase
    $('.purchases').on('click', '.btn-delete', async (element) => {
        var purchaseID = element.target.dataset.id;
        await purchaseService.deletePurchase(purchaseID);
        purchases = await purchaseService.getPurchasesByUserID(userID)
        renderPurchases();
    });
})

// Checks if there are purchases or no and render it
function renderPurchases() {
    var htmlStrs;
    if (purchases.length === 0) {
        htmlStrs = getNoPurchasesHtml();

    } else {
        htmlStrs = purchases.map(getPurchaseHtmlStr);
    }
    $('.purchases').html(htmlStrs);
}

// If there were no purchases made 
function getNoPurchasesHtml() {
    return `
    <p style="margin: 30px 10px 0; font-size:1.1rem;font-weight: bold;">Your purchase history is empty<p>
    `;
}

// Return HTML string of each purchase 
function getPurchaseHtmlStr(purchase, idx) {
    var dateString = getDateString(purchase.purchaseDate) + '/' + new Date(purchase.purchaseDate).getFullYear();
    var htmlStr = `
    <div class="flex align-items-center" id="purchase-${idx}">
        <a class="purchase-link" href="/purchases/${purchase._id}" id>
            <table class="purchase">
                <thead>
                    <tr>
                        <td colspan="3">Purchase ID: <span class="id">${purchase._id}</span></td>
                    </tr>
                </thead>
                <tbody>
                    <td>Purchase date:</td>
                    <td>Total price:</td>
                </tbody>
                <tfoot>
                    <td>${dateString}</td>
                    <td>${purchase.price.totalPrice.toFixed(2)}₪</td>
                </tfoot>
            </table>
        </a>
        <button class="btn-delete" data-id="${purchase._id}">Delete</button>
    </div>`;
    return htmlStr;
}
