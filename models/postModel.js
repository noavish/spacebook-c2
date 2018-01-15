var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    userName: String,
    comment: String
});

var postSchema = new mongoose.Schema({
    postText: String,
    comments: [commentSchema]
});



var Post = mongoose.model('post', postSchema);
var Comment = mongoose.model('comment', commentSchema);

// module.exports = Post;
module.exports = Post;

