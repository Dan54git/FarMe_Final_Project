
var url = location.hostname === 'localhost' ? '//localhost:3000/api/purchase' : '/api/purchase';


export var purchaseService = {
    getPurchasesByUserID,
    createPurchases,
    deletePurchase,
    getPurchaseById
};

async function getPurchasesByUserID(userID) {
    try {
        var purchases = await axios.get(`${url}?userID=${userID}`); // api/routes/purchase/getPurchasesByUserID
        return purchases.data;
    } catch (error) {
        console.error(error);
    }
}

async function createPurchases(purchase) {
    try {
        var newPurchase = await axios.post(url, purchase); // api/routes/purchase/createPurchase
        return newPurchase.data;
    } catch (error) {
        console.error(error);
    }
}

async function deletePurchase(purchaseID) {
    try {
        return await axios.delete(`${url}/${purchaseID}`); // api/routes/purchase/deletePurchase
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getPurchaseById(purchaseID) {
    try {
        var purchase = await axios.get(`${url}/${purchaseID}`); // api/routes/purchase/getPurchaseById
        return purchase.data;
    } catch (error) {
        console.error(error);
    }
}
