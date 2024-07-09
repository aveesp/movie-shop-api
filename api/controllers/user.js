const mongoose = require('mongoose');

const bcrypt = require('bcrypt');
require('dotenv').config();

const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.login = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            console.log(process.env.JWT_Token);
            if(user.length < 1) {
                return res.status(400).json({
                    message: 'Authentication failed'
                })
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
                if(err) {
                    return res.status(410).json({
                        message: 'Authentication failed'
                    });
                }
                if(result){
                    const token = jwt.sign(
                        {
                            email: user[0].email,
                            userId: user[0]._id,
                        },
                        process.env.JWT_Token_SECRET_KEY,
                        {
                            expiresIn: "1h"
                        }
                    )
                    return res.status(200).json({
                        message: 'Authentication successful',
                        token: token
                    })
                }
                console.log(result);
                res.status(401).json({
                    message: 'Authentication failed'
                })
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err.message
            })
        });
}

exports.signup = function(req, res, next) {
    User
        .find({ email: req.body.email})
        .exec()
        .then(user => {
            if(user.length >= 1) {
                return res.status(409).json({
                    error: 'User already exists'
                });
            }
            else{
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user
                        .save()
                        .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User created"
                        });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err
                            });
                        });
                    }
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
}

exports.deleteUser = (req, res, next) => {
    User.remove({ _id: req.params.id })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "User deleted successfully!!"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err.message
            })
        })
}