var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongoose://localhost/spacebookDB', function () {
    console.log("DB connection established!");
});

// var Post = require('./models/postModel');
var Model = require('./Models/postModel'); //{ Post, Comment }

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// app.get('/', function (req, res) {
//     res.send(Model);
// });


// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
// 2) to handle adding a post
// 3) to handle deleting a post
// 4) to handle adding a comment to a post
// 5) to handle deleting a comment from a post

app.listen(8000, function () {
    console.log("what do you want from me! get me on 8000 ;-)");
});


