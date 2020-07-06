const mongoose = require('mongoose');

const featuresSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
});

const Features = mongoose.model('Features', featuresSchema);

module.exports = Features;