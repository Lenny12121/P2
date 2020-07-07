const express = require('express');
const router = express.Router();

const Features = require('../models/features');

// Index Route

router.get('/', (req, res) =>   {
    Features.find({}, (err, allFeatures) =>  {
        if (err) {
            console.log(err);
            res.send(err);
        } else
            res.render('index.ejs',  {
                features: allFeatures,
        });
    });
});

//New Feature Request
router.get('/new', (req, res) =>  {
    res.render('new.ejs',  {
    });
});

router.post('/', (req, res) =>  {
    Features.create(req.body, (err, newFeature) =>  {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.redirect('/feature-requests/');
        };
    })
});

// Show Route
router.get('/:id', (req, res) =>  {
    Features.findById(req.params.id, (err, foundFeature) => {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.render('show.ejs',  {
                feature: foundFeature,
            });
        }
    });
});

//edit route
router.get('/:id/edit', (req, res) => {
    // res.send('edit me baby')
    Features.findById(req.params.id, (err, foundFeature) => {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.render('edit.ejs',  {
                feature: foundFeature,
        })}
    });
});

router.put('/:id', (req, res) => {
    Features.findByIdAndUpdate(req.params.id, req.body, (err, foundFeature) =>  {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.redirect('/feature-requests')
        }
    });
});

router.put('/comments/:id', (req, res) => {
    console.log(req.body);
    Features.findByIdAndUpdate(req.params.id,  {$push: {comments: req.body.comments}}, (err, foundFeature) =>  {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.redirect('/feature-requests/' + req.params.id)
        }
    });
});

//delete route
router.delete('/:id', (req, res) => {
    Features.findByIdAndRemove(req.params.id, {useFindAndModify: false}, (err, deletedFeature) =>   {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            res.redirect('/feature-requests');
        }
    });
});






module.exports = router;