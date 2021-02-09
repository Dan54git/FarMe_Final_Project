import { itemsCartService } from '../services/itemsCart.js';
import { userService } from '../services/user.js';

window.onRemoveItemCart = onRemoveItemCart;

$(window).on('load', renderCart);

async function renderCart() {
    var itemsCart = await itemsCartService.loadItemsCart();
    if (itemsCartService.getItemsCount()) { // There are items in the cart
        renderItemsCart(itemsCart);
        renderOrderSummery();
    } else {
        renderCartIsEmpty() // Render Empty cart page
    }
}

function renderItemsCart(itemsCart) {
    var itemsCartHTMLstr = itemsCart.map(getItemCartHTMLstr);
    $('table tbody').html(itemsCartHTMLstr);
}

function getItemCartHTMLstr(itemCart) {
    var product = itemCart.productID;
    return `
        <tr>
            <td class="item-img">
                <div>
                    <img src="./images/products/${product.img}" />
                    <p class="product-name">${product.name}</p>
                </div>
            </td>
            <td>
                <P><span class="units-count">${product.price}</span>₪ for package</P>
            </td>
            <td>
                <p class="units-count">${itemCart.units}</p>
            </td>
            <td>
                <p><span class="price-amount">${(itemCart.units * product.price.toFixed(2))}</span>₪</p>
            </td>
            <td>
                <button class="btn-remove" onclick="onRemoveItemCart('${itemCart._id}')">Remove</button>
            </td>
        </tr>
    `;
}

async function renderOrderSummery() {
    var itemsCart = await itemsCartService.getItemsCart();
    var itemsPrice = calcItemsCartPrice(itemsCart)
    var deliveryPrice = 10;
    var HTMLsrt = `
        <h2>Order summery</h2>
        <div class="row">
            <P class="title">Price</P>
            <p class="total-price"><span class="amount">${itemsPrice.toFixed(2)}</span>₪</p>
        </div>
        <div class="row">
            <P class="title">Delivery price</P>
            <p class="delivery -price"><span class="amount">${deliveryPrice}</span>₪</p>
        </div>
        <div class="row contain-total-price">
            <P class="title">Total Price</P>
            <p class="total-price"><span class="amount">${(itemsPrice + deliveryPrice).toFixed(2)}</span>₪</p>
        </div>
        <div class="flex justify-content-center">
            <a href="/order" class="btn-continue">Continue</a>
        </div>
    `;
    $('.order-summery').html(HTMLsrt);
}

function renderCartIsEmpty() { // Render Cart Empty page
    var htmlStr = `
        <h1>MY Shopping cart</h1>
        <img class="img-cart" src="./images/cartImg.png" />
        <p class="empty-cart-title">
            Your Shopping Cart is empty
        <P>
    `;
    $("main").html(htmlStr);
}

function calcItemsCartPrice(items) { // Calculate Total price of the items in the cart
    var itemsPrice = 0;
    items.forEach((item) => {
        itemsPrice += item.units * item.productID.price;
    })
    return itemsPrice;
}

async function onRemoveItemCart(itemCartID) { // Removes an item from the cart and render the cart again
    await itemsCartService.removeItemCart(itemCartID);
    renderCart();
}
