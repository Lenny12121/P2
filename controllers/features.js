const express = require('express');
const router = express.Router();

const Features = require('../models/features');
const User = require('../models/users');

//new
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },

    // By default, multer removes file extensions so let's add them back
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

// router.post('/', (req, res) =>  {
//     // console.log(req.body)
//     User.findById(req.body.attachedToCompany, (err, foundUser) =>  {
//         Features.create(req.body, (err, newFeature) =>  {
//             if (err) {
//                 res.send(err);
//                 console.log(err);
//             } else {
//                 foundUser.featureRequests.push(newFeature);
//                 foundUser.save((err, data) =>   {
//                     if (err) {
//                         res.send(err);
//                         console.log(err);
//                     } else {
//                         res.redirect('/feature-requests/' + foundUser.company);
//                     }
//                 })
//             };
//         });
//     });
// });


//NEW
//Used Multer walkthrough from here:  https://stackabuse.com/handling-file-uploads-in-node-js-with-expres-and-multer/

const helpers = require('./helpers');

router.post('/', (req, res) =>  {
        
    console.log('this is the req.body: ' + req.body)
        let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('image');

        upload(req, res, function(err) {
                        // req.file contains information of uploaded file
                        // req.body contains information of text fields, if there were any
                        console.log("This is the file: " + req.file);
                        

            if (req.fileValidationError) {
                res.send(req.fileValidationError);
            }
            else if (!req.file) {
                res.send('Please select an image to upload');
                        }
                        else if (err instanceof multer.MulterError) {
                            res.send(err);
                        }
                        else if (err) {
                            res.send(err);
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
            
            console.log('This is the new feature: ' + newFeature)
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



// router.post('/', (req, res) => {
//     // 'profile_pic' is the name of our file input field in the HTML form
//     let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('image');

//     upload(req, res, function(err) {
//         // req.file contains information of uploaded file
//         // req.body contains information of text fields, if there were any

//         if (req.fileValidationError) {
//             return res.send(req.fileValidationError);
//         }
//         else if (!req.file) {
//             return res.send('Please select an image to upload');
//         }
//         else if (err instanceof multer.MulterError) {
//             return res.send(err);
//         }
//         else if (err) {
//             return res.send(err);
//         }

//         // Display uploaded image for user validation
//         res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
//     });
// });

//Upvote/downvote adapted from here: https://github.com/Binayak07/rentomojo_assignment/blob/master/app.js
//UPVOTE/DOWNVOTE
router.post("/upvoted", (req,res) => {
    // console.log('This is the upvote Body ' + req.body.val)
	let id=req.body.id;
    let old=Number(req.body.val);

    Features.findById(id, (err, foundFeature) =>    {
        foundFeature.upvote = foundFeature.upvote + 1;
        console.log('This is the Found Feature: ' + foundFeature)
        foundFeature.save((err, savedFeature) => {
            if (err) {
                res.send(err);
                console.log(err);
            } else {
                console.log('This is the SAVED Feature: ' + savedFeature)

                User.findById(savedFeature.attachedToCompany, (err, foundUser) => {
                    foundUser.featureRequests.id(savedFeature.id).remove();
                    foundUser.featureRequests.push(savedFeature);
                    foundUser.save((err, data) => {
                        console.log('THIS IS THE FOUND USER: ' + foundUser)
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
        console.log('This is the Found Feature: ' + foundFeature)
        foundFeature.save((err, savedFeature) => {
            if (err) {
                res.send(err);
                console.log(err);
            } else {
                console.log('This is the SAVED Feature: ' + savedFeature)

                User.findById(savedFeature.attachedToCompany, (err, foundUser) => {
                    foundUser.featureRequests.id(savedFeature.id).remove();
                    foundUser.featureRequests.push(savedFeature);
                    foundUser.save((err, data) => {
                        console.log('THIS IS THE FOUND USER: ' + foundUser)
                        res.redirect('/feature-requests/' + foundUser.company)                    
                    });
                })
            }
        })
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