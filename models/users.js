const mongoose = require('mongoose');
const features = require('./features');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String, unique: true, required: true, lowercase: true },
    userName: { type: String, unique: true, required: true },
    password: { type: String, unique: true, required: true },
    featureRequests: [features.schema],
    description: { type: String, default: 'Help us get better! Leave us feedback, report bugs and share your thoughts.' },
    logo: { type: String, },
});

//To make the login persistent on signup run the login code here so users are automatically logged 

const User = mongoose.model('User', userSchema);

module.exports = User;