var mongoose = require('mongoose');

//design the two schema below and use sub docs 
//to define the relationship between posts and comments

//you don't need a comments collection
//you only need a posts collection

var commentSchema = new mongoose.Schema({
    userName: String,
    comment: String
});

var postSchema = new mongoose.Schema({
    postText: String,
    comments: [commentSchema]
});

var Post = mongoose.model('post', postSchema);

var cb =function (err,data) {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
};

module.exports = Post;


