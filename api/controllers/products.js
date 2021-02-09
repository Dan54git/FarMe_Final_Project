var mongoose = require('mongoose');
var Product = require('../models/products');

module.exports = {
    //Get products
    getProducts: (req, res) => {
        var { type, q } = req.query;
        var query = {} // for filter
        if (type) query.type = type; // search by category type
        if (q) query.name = { '$regex': '.*' + q.toLowerCase() + '.*', '$options': 'i' }; // for the search by name


        Product.find(query)
            .then(foundProducts => {
                res.status(200).json(foundProducts)
            }).catch(error => {
                console.log('Error: Get products failed')
                console.log(error)
                res.status(500).json({ error: 'Get products failed' })
            });
    },
    // Get one product
    getProduct: (req, res) => {
        var _id = req.params.productId;
        Product.findById(_id).then((foundProduct) => {
            res.status(200).json(foundProduct);
        }).catch((error) => {
            console.log(`Get Product failed (Product: ${_id})`)
            console.log(error)
            res.status(500).json({ error: `Get product failed (Product: ${_id})` })
        });
    },
    // Create new product
    createProduct: (req, res) => {
        var { name, price, img, type } = req.body;

        var product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name,
            price,
            img,
            type
        });

        product.save().then(() => {
            res.status(201).json({
                message: 'A new product has been successfully created'
            });
        }).catch((error) => {
            console.log('Error: Product create failed - Save Product failed');
            console.log(error);
            res.status(500).json({ error: 'Product create failed' });
        });
    },
    // Update product
    updateProduct: (req, res) => {
        var _id = req.params.productId
        var productToUpdate = req.body
        Product.update({ _id }, productToUpdate).then(() => {
            res.status(200).json({ message: `Product details updated (Product: ${_id})` })
        }).catch((error) => {
            console.log('Error: Update product failed (Product: ${_id})');
            console.log(error);
            res.status(500).json({ error: 'Update product failed (Product: ${_id})' });
        });
    },
    // Delete product
    deleteProduct: (req, res) => {
        var _id = req.params.productId
        Product.remove({ _id }).then(() => {
            res.status(200).json({
                message: `Product removed (Product: ${_id})`
            }).catch((error) => {
                console.log(`Error: Remove product failed (Product: ${_id})`);
                console.log(error);
                res.status(500).json({ error: `Product remove failed (Product: ${_id})` });
            })
        });
    }
}
