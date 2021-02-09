/* Imports */
require('dotenv').config();
const express = require("express");
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//Import services
const dbService = require('./services/dataBase');

//Import Routers
const pagesRouter = require('./routes/pages');
const apisRouter = require('./routes/apis');

const app = express();

/* App Config */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: (1000 * 60 * 60 * 3), // Max usage 3 hours and then the session will end
    }
}));
//Static files
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use('/lib', express.static(path.join(__dirname, 'public/lib')));

// Routes
app.use('/api', apisRouter);
app.use('', pagesRouter);



var port = process.env.PORT || 3000;
app.listen(port, () => {
    /*Connecting to DB*/
    console.log(`Server is running on : localhost:${port}`);
    dbService.connectionToDb();
});
