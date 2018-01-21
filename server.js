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
        post.save(function(err , post){
            if (err) {
                throw err;
            }
            console.log(post);
            res.send(post);
        });
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
app.post('/posts/:_id/comments/newComment', function (req, res) {
    if (req.body && req.params._id) {
        let comment = {
            comment: req.body.comment,
            userName: req.body.userName
        };
        Post.findOne({_id: req.params._id}, function (err, post) {
            if (err) {
               throw err;
            }
            var commentsLength = post.comments.push(comment);
            post.save(function(err , data){
                if (err) {
                    throw err;
                }
                res.send({newCommentId: data.comments[commentsLength-1]._id});
            });
        });
    } else{
        res.send({status: "nok", message: "Nothing received."});
    }
});
// 5) to handle deleting a comment from a post
app.delete('/posts/:_id/comments/removeComment', function (req, res) {
    if (req.params._id) {
        console.log(req.params._id);
        console.log(req.body.commentID);
        Post.findOne({_id: req.params._id}).populate('comments').exec(function(err, post){
            if (err) {
                console.error(err);
            } else {
                post.comments.id(req.body.commentID).remove();
                post.save();
                console.log('comment was deleted');
            }
        });
        res.send({status: "ok", message: "Deleted."});
    } else{
        res.send({status: "nok", message: "Nothing received."});
    }
});

app.put('/posts/:_id/updatePost', function (req, res) {
    if (req.params._id) {
        console.log(req.params._id);
        Post.findByIdAndUpdate(req.params._id, { $set: { postText: req.body.postText }}, { new: true },  function (err, post) {
            if (err) {
                console.error(err);
            } else {
                console.log(post.postText);
                res.send(post.postText);
            }
        });
    } else{
        res.send({status: "nok", message: "Nothing received."});
    }
});

app.put('/posts/:_id/comments/sort', function (req, res) {
    if (req.params._id) {
        console.log(req.params._id);
        Post.findById(req.params._id, function (err, post) {
            if (err) {
                console.error(err);
            } else {
                var temp = post.comments.splice(req.body.oldIndex, 1)[0];
                post.comments.splice(req.body.newIndex, 0, temp);
                post.save();
            }
        });
    } else{
        res.send({status: "nok", message: "Nothing received."});
    }
});

app.listen(8000, function() {
  console.log("what do you want from me! get me on 8000 ;-)");
});



