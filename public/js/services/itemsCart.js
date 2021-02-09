import { renderItemCount } from '../controllers/navBar.js';


export var itemsCartService = {
    addItemCart,
    removeItemCart,
    getItemsCart,
    getIDXItemCartByID,
    getItemCartById,
    loadItemsCart,
    getItemsCount,
    loadItemsCount,
    updateItemsCount,
    deleteCartByUserID,
}

/* Global variables */
var itemsCart = null;
var itemsCount = 0;
var url = location.hostname === 'localhost' ? '//localhost:3000/api/itemCart' : '/api/itemCart';


/* Items cart */
async function loadItemsCart() {
    if (itemsCart) return itemsCart;
    if (sessionStorage.getItem('itemsCart') === null) {
        await axios.get(url).then((res) => {
            itemsCart = res.data;
            sessionStorage.setItem('itemsCart', JSON.stringify(itemsCart));
        });
    } else {
        itemsCart = JSON.parse(sessionStorage.getItem('itemsCart'));
    };
    return itemsCart;
}

async function addItemCart(itemToAdd) {
    var item;
    var itemCartIDX = getIDXItemCartByID(itemToAdd.productID) // Check if item exists in the list (If not will return -1)
    if (itemCartIDX === -1) { // If the item doesn't exists the item will be added
        await axios.post(url, itemToAdd) // api/routes/itemCart.js
            .then((res) => {
                item = res.data
                var itemsCount = updateItemsCount(1);
                renderItemCount(itemsCount);
            });
    } else { // If the item exists - checks if needs to update the unitsItem
        item = itemsCart.splice(itemCartIDX, 1)[0]; 
        item.units = itemToAdd.units;
        await axios.patch(`${url}/${item._id}`, item);
    }
    itemsCart.push(item);
    sessionStorage.setItem('itemsCart', JSON.stringify(itemsCart));
}

function removeItemCart(itemCartID) {
    return axios.delete(`${url}/${itemCartID}`).then(() => {  // api/controllers/itemsCart.js
        itemsCart = itemsCart.filter((item) => item._id !== itemCartID);
        sessionStorage.setItem('itemsCart', JSON.stringify(itemsCart));
        var itemsCount = updateItemsCount(-1);
        renderItemCount(itemsCount);
    }).catch(err => {
        console.error(err);
        return Promise.reject(err)
    })
}

function getItemsCart() {
    return itemsCart;
}

function getItemCartById(productID) {
    return itemsCart.find(item => item.productID._id === productID); // JS func - if recevis true returns the item
}

function getIDXItemCartByID(itemID) {
    return itemsCart.findIndex(item => item.productID._id === itemID);  // JS func - if recevis true returns the index
}

/* Items counter */
async function loadItemsCount() {
    try {
        if (itemsCount) return itemsCount;
        if (sessionStorage.getItem('itemsCount') === null) {
            itemsCount = await axios.get(`${url}/count`).then((res) => res.data)
            sessionStorage.setItem('itemsCount', JSON.stringify(itemsCount));
        } else {
            itemsCount = JSON.parse(sessionStorage.getItem('itemsCount'));
        }
        return itemsCount;
    } catch (error) {
        console.error(error);
        throw error
    }
}

function updateItemsCount(param) { // Updates the number of items that are in the cart
    itemsCount += param;
    sessionStorage.setItem('itemsCount', JSON.stringify(itemsCount));
    return itemsCount;
}

function getItemsCount() {  // Returns the global number of items in the cart
    return itemsCount;
}

async function deleteCartByUserID(userID) {
    try {
        var res = await axios.delete(`${url}/cart/${userID}`).then(res => res) // api/routes/itemsCart/deleteCart
        sessionStorage.removeItem('itemsCart'); // Reset itemsCart data
        sessionStorage.removeItem('itemsCount'); // Reset itemsCount data
        return res;
    } catch (error) {
        console.error(error);
        throw error; // Present the error message
    }
}
