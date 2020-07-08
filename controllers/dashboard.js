const express = require('express');
const dashboardRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Features = require('../models/features');


const isAuthenticated = (req, res, next) => {
    if (req.session.currentUser) {
        return next()
    } else {
        res.redirect('/login/new');
    }
};

dashboardRouter.get('/:company', (req, res) =>   {
    console.log('this is the body: ' + req.body)
    console.log('this is the req.params.company: ' + req.params.company)
    User.find({company: req.params.company}, (err, foundUser) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            // console.log(foundUser[0].featureRequests)
            res.render('dashboard/index.ejs',  {
                company: req.params.company, 
                user: foundUser[0],
            });
        }
    });
});

//delete route
dashboardRouter.delete('/:company/:id', (req, res) => {
    Features.findByIdAndRemove(req.params.id, {useFindAndModify: false}, (err, deletedFeature) =>   {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            User.findOne({company: req.params.company}, (err, foundUser) => {
                foundUser.featureRequests.id(req.params.id).remove();
                foundUser.save((err, data) => {
                    res.redirect('/dashboard/' + req.params.company);
                });
            });
        }
    });
});

module.exports = dashboardRouter;