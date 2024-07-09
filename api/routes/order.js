const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const OrderController = require('../controllers/orders');

router.get('/', checkAuth, OrderController.Order_get_all);

router.post('/', checkAuth, OrderController.create_order);


router.get('/:orderId', checkAuth, OrderController.get_order);

router.delete('/:orderId', checkAuth, OrderController.delete_order);

module.exports = router;