const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const mongodbURI = process.env.MONGODB_URI || 'mongodb://localhost/' + 'addthat';
const session = require('express-session');

app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

mongoose.connect(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true } );
mongoose.connection.once('open', ()=> {
    console.log('I am the Mongod!');
});

const Features = require('./models/features.js');

const featuresController = require('./controllers/features.js');
app.use('/feature-requests', featuresController);

const userController = require('./controllers/users');
app.use('/sign-up', userController);

const sessionController = require('./controllers/sessions');
app.use('/login/', sessionController);

const dashboardController = require('./controllers/dashboard');
app.use('/dashboard/', dashboardController);

app.listen(PORT, () =>  {
    console.log('I told you not to drink and cook!')
})
