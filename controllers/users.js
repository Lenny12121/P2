const express = require('express');
const userRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Features = require('../models/features');


userRouter.get('/new', (req, res) => {
    res.render('users/new.ejs',  {
    });
});

userRouter.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(15));
    User.create(req.body, (err, newUser) => {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.redirect('/dashboard/' + req.body.company);
        }
    });
});

module.exports = userRouter;