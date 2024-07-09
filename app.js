const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors  = require('cors');
const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');


// mongoose.connect(`mongodb+srv://${process.env.MONGO_ATLAS_UN}:${process.env.MONGO_ATLAS_PW}@cluster0.tp8jaep.mongodb.net/node-rest-api?retryWrites=true`);
mongoose.connect(`mongodb+srv://aveesp:GcqsrHIi4Ju3rds7@cluster0.tp8jaep.mongodb.net`);
mongoose.Promise = global.Promise;
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(cors());

app.use((req, res, next) => {
    res.header(`Access-Control-Allow-Origin`, `*`);
    res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
    res.header(`Access-Control-Allow-Headers`, `Content-Type`);
    next();
});
  
// app.use((req, res, next) => {
//     req.header('Access-Control-Allow-Origin', '*');
//     req.header('Access-Control-Allow-header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

//     if(req.method === 'OPTIONS'){
//         req.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH')
//         return res.status(200).json();
//     }
// });

// api routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status(404);
    next(error);
})

app.use(( error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        }
    })
})

module.exports = app;