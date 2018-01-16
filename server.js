var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/spacebookDB', {useMongoClient:true});
mongoose.connection.once('open',function () {
    console.log("DB connection established!!!");
}).on('error',function (error) {
    console.log('CONNECTION ERROR:',error);
});

var Post = require('./models/postModel');

var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// You will need to create 5 server routes
// These will define your API:

// 1) to handle getting all posts and their comments
app.get('/posts', function (req, res) {
    Post.find(function(err, posts) {
        if (err) {
            console.error(err);
        } else {
            res.json(posts);
        }
    });
});
// 2) to handle adding a post
app.post('/posts', function (req, res) {
    if (req.body) {
        console.log(req.body);
        var post = new Post({
            postText: req.body.postText,
            comments: []
        });
        post.save();
        res.send({status: "ok", message: "Received."});
    } else{
        res.send({status: "nok", message: "Nothing received."});
    }
});

// 3) to handle deleting a post
app.delete('/posts/:_id', function (req, res) {
    if (req.params._id) {
        console.log(req.params._id);
        Post.findByIdAndRemove(req.params._id, function (err) {
            if (err) {
                console.error(err);
            } else {
                console.log('post was deleted');
            }
        });
        res.send({status: "ok", message: "Deleted."});
    } else{
        res.send({status: "nok", message: "Nothing received."});
    }
});
// 4) to handle adding a comment to a post
app.post('/posts/:_id/comments', function (req, res) {
    if (req.body && req.params._id) {
        let comment = {
            comment: req.body.text,
            userName: req.body.user
        };
        Post.findOne({_id: req.params._id}, function (err, post) {
            if (err) {
               throw err;
            } else {}
            post.comments.push(comment);
            post.save(function(err , data){
                if (err) {
                    throw err;
                }
                res.send({status: "ok", message: data});

            });
        });
    } else{
        res.send({status: "nok", message: "Nothing received."});
    }
});
// 5) to handle deleting a comment from a post
// app.delete('/posts/:_id/comments', function (req, res) {
//     if (req.params._id) {
//         console.log(req.params._id);
//         Post.findByIdAndRemove(req.params._id, function (err) {
//             if (err) {
//                 console.error(err);
//             } else {
//                 console.log('post was deleted');
//             }
//         });
//         res.send({status: "ok", message: "Deleted."});
//     } else{
//         res.send({status: "nok", message: "Nothing received."});
//     }
// });

app.listen(8000, function() {
  console.log("what do you want from me! get me on 8000 ;-)");
});



