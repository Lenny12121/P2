const mongoose = require('mongoose');

const featuresSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    comments:  [{type: String}],
    attachedToCompany: { type: String, required: true },
    companyName: { type: String, required: true },
});

const Features = mongoose.model('Features', featuresSchema);

module.exports = Features;