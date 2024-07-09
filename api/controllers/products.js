const mongoose = require('mongoose');

const Product = require('../models/product');

exports.getAllProducts = (req, res, next)=>{
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(result=>{
            console.log(result);
            const response = {
                count: result.length,
                products: result.map(product=>{
                    return {
                        _id: product._id,
                        name: product.name,
                        price: product.price,
                        productImage: product.productImage,
                        requestType: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + product._id,
                        }
                    }
                })
            }

            res.status(200).json(response);
        }).catch((err)=>{
            // console.log(err);
            res.status(500).json({error: err});
        });
}

exports.createProduct = (req, res, next)=>{
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message: 'product created successfully',
            createdProduct: {
                _id: result._id,
                name: result.name,
                price: result.price,
                productImage: result.productImage,
                request:{
                    type: 'POST',
                    url: 'http://localhost:3000/products/' + result._id,
                }
            }
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    });

}

exports.getProduct = (req, res, next)=>{
    const id = req.params.productId;
    Product.findById(id)
    .exec()
    .then(result=>{
        console.log(result);
        result ? res.status(200).json({
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + result._id,
            }
        }) : res.status(500).json({message: 'No Valid entry found for provided ID'});
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    })
}

exports.updateProduct = (req, res, next)=>{
    const id = req.params.productId;
    console.log(id, req.body);
    let updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then((result)=>{
        res.status(200).json({
            message: 'product Updated successfully!',
            name: result.name,
            price: result.price,
            _id: result._id,
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/' + result._id,
            }
        });;
    })
    .catch(err=>{
        res.status(500).send(err);
    });
}

exports.deleteProduct = (req, res, next)=>{
    const id = req.params.productId;
    Product.remove({_id: id}).exec().then(result=>{
        res.status(200).json({
            message: 'Product Deleted successfully',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/products/',
                body: { name: 'String', price: 'Number'}
            }
        });
    }).catch(err=>{
        logger.error(err);
        res.status(500).json({
            error: err
        })
    });
}