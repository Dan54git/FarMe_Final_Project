import { productsService } from '../services/products.js';
import { itemsCartService } from '../services/itemsCart.js';
import { userService } from '../services/user.js';
import { getUrlParams, findParamByName } from './../utils.js';

/* Global variables */
var unitsItem = 0;

window.onAddItem = onAddItem;

$(window).on('load', async function () {
    if (userService.getUser()) {
        itemsCartService.loadItemsCart(); // get user cartItems
    }

    var prams = getUrlParams();
    var type = findParamByName(prams, 'type');
    var category = type ? type.value : ''; // Vegetables or Fruits or all "As products"
    headerRender(category);
    var products = await productsService.getProducts(prams); // Receives the products to "products"
    productsRender(products);  // Render the products to the page
    addListeners();
});

function addListeners() {
    //Items store
    $(".screen").click(showModal);
}

// Rendering title and image of the header page
function headerRender(type) {
    var title, img;
    switch (type) {
        case 'fruit':
            title = 'Fruits';
            img = 'fruitsImg.jpg'
            break;
        case 'vegetable':
            title = 'Vegetables';
            img = 'vegetablesImg.jpg'
            break;
        default:
            title = 'As products';
            img = 'vegetablesImg.jpg';
            break;
    }
    $('.main-title').text(title)
    $('.img-header').attr('src', `./images/store/${img}`)
}

// Rendering the products to the store page 
function productsRender(products) {
    var HTMLStrs;
    if(products.length){
        HTMLStrs = products.map(product => {
            return `<div class="item">
                <img src="./images/products/${product.img}">
                <p class="name">${product.name}</p>
                <p class="details">Package about 1 kg</p>
                <p class="price"><span class="amount">${product.price}</span>₪ for package</p>
                <button class="btn-add-item" onclick="onAddItem('${product._id}')">Add</button>
            </div>`
        });
    } else {
        HTMLStrs = `<div class="item-not-found">
                    <p> No products found </p>
                    </div>`;
    }
    $(".items-container").html(HTMLStrs)
}

async function onAddItem(itemId) {
    if (!userService.getUser()) {  // checks if the user is loged in
        window.location.href = '/login';
    }
    var itemModal;  // will be the productID
   
    var itemCart = itemsCartService.getItemCartById(itemId);  // Checks if the item is in the cart and initializes the units item
    if (itemCart) {
        unitsItem = itemCart.units;
        itemModal = itemCart.productID;
    } else {
        unitsItem = 1;
        itemModal = await productsService.getProductById(itemId);
    }
    showModal(itemModal);
}

/* Modal functions */

function showModal(item) {
    if (item) {
        var totalPrice = item.price * unitsItem;
        var HTMLstr = `
        <img src="./images/products/${item.img}" />
        <div style="width: 176px ;">
            <button class="btn-close"></button>
            <h2>${item.name}</h2>
            <p>package about 1 kg</p>
            <p class="price">${item.price}₪ for package</p>
            <div class="units">
                <p>Unit/s</p>
                <input class="unit-item" type="number" min="1" max="50" value="${unitsItem}" />
            </div>
            <p class="total-price">total price: <span>${totalPrice.toFixed(2)}</span>₪</p>
            <button class="btn-add" >Add item</button>`
        $('.modal').html(HTMLstr) // render "Modal item" . toFixed(2) = two didits after "." and rounds it. 

        // Listeners
        $(".modal .btn-close").click(function () { showModal() });
        $(".modal .unit-item").change(function () { clacTotalPrice(this.value, item.price) });
        $(".modal .btn-add").click(function () { onModalBtn(item._id) });
    }
    $('.screen').toggle();
}

/**  Calculating total price of item and rendering it
 * @param units Number of product units
 * @param price Product price
 */
function clacTotalPrice(units, price) {
    if (parseInt(units) > 50) {
        units = 50;
        $(".unit-item").val("50");
    } else if (parseInt(units) < 1) {
        units = 1;
        $(".unit-item").val("1");
    }
    unitsItem = units // updates the global var for the end cases
    var totalPrice = (units * price).toFixed(2);
    $(".total-price span").text(totalPrice);
}

function onModalBtn(productID) {
    showModal();
    var item = {
        productID,
        units: parseInt(unitsItem, 10) // converts the string to int in a 10 base
    }
    itemsCartService.addItemCart(item);
}
