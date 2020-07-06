const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: { type: String, unique: true, required: true },
    password: { type: String, unique: true, required: true },
});

//To make the login persistent on signup just run the login code here

const User = mongoose.model('User', userSchema);

modules.export = User;