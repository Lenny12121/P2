const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');

userRouter.get('/new', (req, res) => {
    res.render('users/new.ejs',  {
        // currentUser = req.session.currentUser
    });
});

userRouter.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(15));
    User.create(req.body, (err, newUser) => {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.redirect('/feature-requests');
        }
    });
});

module.exports = userRouter;