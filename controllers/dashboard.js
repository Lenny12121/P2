const express = require('express');
const dashboardRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');

const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/feature-requests');
    }
};

dashboardRouter.get('/:id', (req, res) =>  {
    res.send('dashboard')
})

module.exports = dashboardRouter;