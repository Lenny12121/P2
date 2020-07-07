const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');

userRouter.get('/new', (req, res) => {
    res.render('users/new.ejs',  {

    });
})

module.exports = userRouter;