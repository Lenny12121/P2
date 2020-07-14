const express = require('express');
const router = express.Router();

const Features = require('../models/features');
const User = require('../models/users');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Index Route

router.get('/:company', (req, res) =>   {
    User.find({company: req.params.company}, (err, foundUser) => {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
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

//NEW
//Used Multer walkthrough from here:  https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/

const helpers = require('./helpers');

router.post('/', (req, res) =>  {
    let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('image');

    upload(req, res, function(err) {
        if (req.fileValidationError) {
            res.send(req.fileValidationError);
            return
        }
        else if (err instanceof multer.MulterError) {
            res.send(err);
            return
        }
        else if (err) {
            res.send(err);
            return
        }

    User.findById(req.body.attachedToCompany, (err, foundUser) =>  {
        console.log('this is the req.file: ' + req.file)
        let newestFeature = {
            comments: [],
            upvote: 0,
            downvote: 0,
            _id: req.body.id,
            title: req.body.title,
            description: req.body.description,
            attachedToCompany: req.body.attachedToCompany,
            companyName: req.body.companyName,
            image: req.file.filename,
        }
        Features.create(newestFeature, (err, newFeature) =>  {
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
});

//Upvote/downvote adapted from here: https://github.com/Binayak07/rentomojo_assignment/blob/master/app.js
//UPVOTE/DOWNVOTE
router.post("/upvoted", (req,res) => {
	let id=req.body.id;
    let old=Number(req.body.val);

    Features.findById(id, (err, foundFeature) =>    {
        foundFeature.upvote = foundFeature.upvote + 1;
        foundFeature.save((err, savedFeature) => {
            if (err) {
                res.send(err);
                console.log(err);
            } else {
                User.findById(savedFeature.attachedToCompany, (err, foundUser) => {
                    foundUser.featureRequests.id(savedFeature.id).remove();
                    foundUser.featureRequests.push(savedFeature);
                    foundUser.save((err, data) => {
                        res.redirect('/feature-requests/' + foundUser.company)                    
                    });
                })
            }
        })
    });
});

router.post("/downvoted", (req, res) => {
    let id=req.body.id;
    let old=Number(req.body.val);

    Features.findById(id, (err, foundFeature) =>    {
        foundFeature.downvote = foundFeature.downvote + 1;
        foundFeature.save((err, savedFeature) => {
            if (err) {
                res.send(err);
                console.log(err);
            } else {
                User.findById(savedFeature.attachedToCompany, (err, foundUser) => {
                    foundUser.featureRequests.id(savedFeature.id).remove();
                    foundUser.featureRequests.push(savedFeature);
                    foundUser.save((err, data) => {
                        res.redirect('/feature-requests/' + foundUser.company)                    
                    });
                })
            }
        })
    });
});

// Show Route
router.get('/:company/:id', (req, res) =>  {
    Features.findById(req.params.id, (err, foundFeature) => {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
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