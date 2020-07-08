const express = require('express');
const User = require('../models/users');
const sessionRouter = express.Router();
const bcrypt = require('bcrypt');

sessionRouter.get(('/new'), (req, res) =>  {
    res.render('sessions/new.ejs');
});

sessionRouter.post('/', (req, res) =>   {
    User.findOne( {userName: req.body.userName }, (err, foundUser) => {
        if (err) {
            res.send('Apologies we are experiencing some slight difficulties with our Database. Our team has been notified.');
            console.log(err);
        } else if (!foundUser) {
            res.send('Incorrect Username or Password')
        } else {
            if (bcrypt.compareSync(req.body.password, foundUser.password)) {
                req.session.currentUser = foundUser;
                res.redirect('/dashboard/' + foundUser.company);
            } else {
                res.send('Incorrect Username or Password');
            }
        }
    });
});

sessionRouter.delete('/', (req, res) => {
    req.session.destroy(() =>  {
        res.redirect('#');
    });
});

module.exports = sessionRouter;
