const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const mongoose = require('mongoose');

const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const ProductController = require('../controllers/products');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname)
    }
  })
  

const fileFilter = (req, file, cb) => {
    if(file.mimeType === 'image/jpeg' || file.mimeType === 'image/png') {
        cb(null, false);
    }
    else{
        cb(null, true);
    }
}
  
const upload = multer({ 
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// const upload = multer({dest: 'uploads/'});

router.get('/', checkAuth, ProductController.getAllProducts);

router.post('/', checkAuth, upload.single('productImage'), ProductController.createProduct);

router.get('/:productId', checkAuth, ProductController.getProduct);

router.patch('/:productId', checkAuth, ProductController.updateProduct);
router.delete('/:productId', checkAuth, ProductController.deleteProduct);

module.exports = router;