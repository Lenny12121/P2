const express = require('express');
const router = express.Router();

const Features = require('../models/features');
const User = require('../models/users');

// Index Route

router.get('/:company', (req, res) =>   {
    console.log('this is the body: ' + req.body)
    console.log('this is the req.params.company: ' + req.params.company)
    User.find({company: req.params.company}, (err, foundUser) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            // console.log(foundUser[0].featureRequests)
            res.render('index.ejs',  {
                company: req.params.company, 
                user: foundUser[0],
                currentUser: req.session.currentUser
            });
        }
    });
});

//New Feature Request
router.get('/:company/new', (req, res) =>  {
    User.find({company: req.params.company}, (err, foundUser) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log(foundUser[0])
            res.render('new.ejs',  {
                company: req.params.company, 
                user: foundUser,
                currentUser: req.session.currentUser
            });
        }
    });
});

router.post('/', (req, res) =>  {
    // console.log(req.body)
    User.findById(req.body.attachedToCompany, (err, foundUser) =>  {
        Features.create(req.body, (err, newFeature) =>  {
            if (err) {
                res.send(err);
                console.log(err);
            } else {
                foundUser.featureRequests.push(newFeature);
                foundUser.save((err, data) =>   {
                    if (err) {
                        res.send(err);
                        console.log(err);
                    } else {
                        res.redirect('/feature-requests/' + foundUser.company);
                    }
                })
            };
        });
    });
});

// Show Route
router.get('/:company/:id', (req, res) =>  {
    console.log('This is the Company: ' + req.params.company)
    Features.findById(req.params.id, (err, foundFeature) => {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            console.log(foundFeature)
            res.render('show.ejs',  {
                company: req.params.company,
                feature: foundFeature,
                currentUser: req.session.currentUser
            });
        }
    });
});

//Add Comments
router.put('/comments/:id', (req, res) => {
    console.log(req.body);
    Features.findByIdAndUpdate(req.params.id,  {$push: {comments: req.body.comments}}, (err, foundFeature) =>  {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.redirect('/feature-requests/' + foundFeature.companyName + '/' + req.params.id)
        }
    });
});

module.exports = router;