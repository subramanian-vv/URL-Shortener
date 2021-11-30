const express = require('express');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');

//Link model
const Link = require('./models/Link');

const app = express();

//Dotenv config
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//DB Config
const db = process.env.MONGO_URI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(function() {
        console.log('Mongo DB connected...');
    })
    .catch(function(err) {
        console.log(err);
    });

//EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);

//Body Parser
app.use(express.urlencoded({ extended: false }));

//Get home page
app.get('/', async function(req, res) {
    const links = await Link.find().sort({ date: 'desc' });
    res.render('index', {
        links: links
    });
});

//Processes the input on submitting the form
app.post('/url', function(req, res) {
    var newLink = {
        inputURL: req.body.url
    };

    Link.create(newLink, function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
            console.log('Done');
        }
    });
});

//Redirects the shortened link to the actual link
app.get('/:shortURL', async function(req, res) {
    const shortURL = await Link.findOne({ shortURL: req.params.shortURL });
    if(shortURL == null) {
        res.render('404');
    } else {
        res.redirect(shortURL.inputURL);
    }
});

//Listening on localhost:3000 or environment variable PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log(`Listening on port ${PORT}`);
});