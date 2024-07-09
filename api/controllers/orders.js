const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.Order_get_all = function(req, res, next) {
    Order.find()
      .select("product quantity _id")
      .populate('product', 'name price')
      .exec()
      .then(docs => {
        res.status(200).json({
          count: docs.length,
          orders: docs.map(doc => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                type: "GET",
                url: "http://localhost:3000/orders/" + doc._id
              }
            };
          })
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
    });
}

exports.create_order = function(req, res, next) {
    Product.findById(req.body.productId)
    .then(product => {
        if(!product){
            return res.status(404).json({
                message: "Product not found"
            })
        }
        const order = new Order({
            _id: new mongoose.Types.ObjectId(),
            product: req.body.productId,
            quantity: req.body.quantity
        });
        return order.save();
    })
    .then(result =>{
        console.log(result);
        res.status(201).json({
            message: "Order Created successfully",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            response: {
                type: 'POST',
                url: "http://localhost:3000/orders/" + result._id
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });
}

exports.get_order = (req, res, next)=>{
    Order.findById(req.params.orderId)
    .select('id product quantity')
    .exec()
    .then(result =>{
        console.log(result);
        res.status(200).json({
            order: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        })
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err.message
        });
    })
}

exports.delete_order = (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Order deleted",
          request: {
            type: "POST",
            url: "http://localhost:3000/orders",
            body: { productId: "ID", quantity: "Number" }
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
}