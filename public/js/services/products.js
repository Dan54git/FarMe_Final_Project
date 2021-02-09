export var productsService = {
    getProducts,
    getProductById
}

var url = location.hostname === 'localhost'
    ? '//localhost:3000/api/product'
    : '/api/product';



async function getProducts(prams = null) {
    var query = '';
    if (prams) {  // If the params is not empty if false then the query will be empty
        $.each(prams, (index, param) => {
            if (index > 0) query += '&';
            query += `${param.name}=${param.value}`
        });
    }

    var products = await axios.get(`${url}?${query}`) // api/routes/products.js
    return products.data;
}

async function getProductById(productID) {
    var res = await axios.get(`${url}/${productID}`); // api/routes/products.js
    var product = res.data;
    return product;
}
