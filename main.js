var SpacebookApp = function () {
    var posts = [
        // {text: "Hello world", id: 0, comments:[
        //   { text: "Man, this is a comment!"},
        //   { text: "Man, this is a comment!"},
        //   { text: "Man, this is a comment!"}
        // ]},
        // {text: "Hello world", id: 0, comments:[
        //   { text: "Man, this is a comment!"},
        //   { text: "Man, this is a comment!"},
        //   { text: "Man, this is a comment!"}
        // ]},
        // {text: "Hello world", id: 0, comments:[
        //   { text: "Man, this is a comment!"},
        //   { text: "Man, this is a comment!"},
        //   { text: "Man, this is a comment!"}
        // ]}
    ];

    // the current id to assign to a post
    var currentId = 0;
    var $posts = $('.posts');

    var _findPostById = function (id) {
        for (var i = 0; i < posts.length; i += 1) {
            if (posts[i].id === id) {
                return posts[i];
            }
        }
    }

    var createPost = function (text) {
        var post = {
            text: text,
            id: currentId
        }

        currentId += 1;

        posts.push(post);
    }

    var renderPosts = function () {
        $posts.empty();

        for (var i = 0; i < posts.length; i += 1) {
            var post = posts[i];
            var commentsContainer = '<div class="comments-container">' +
                '<input type="text" class="comment-name">' +
                '<button class="btn btn-primary add-comment">Post Comment</button> <ul></ul></div>';
            
            $posts.append('<div class="post" data-id=' + post.id + '>'
                + '<a href="#" class="remove">remove</a> ' + '<a href="#" class="show-comments">comments</a> ' + post.text +
                commentsContainer + '</div>');
            renderComments($(`.post[data-id=${post.id}]`).children('.comments-container').children('.add-comment'));
        }
    }

    var removePost = function (currentPost) {
        var $clickedPost = $(currentPost).closest('.post');
        var id = $clickedPost.data().id;

        var post = _findPostById(id);

        posts.splice(posts.indexOf(post), 1);
        $clickedPost.remove();
    }

    var toggleComments = function (currentPost) {
        var $clickedPost = $(currentPost).closest('.post');
        $clickedPost.find('.comments-container').toggleClass('show');
    }

    var createComment = function (commentBtn) {
        var $clickedPost = $(commentBtn).closest('.post');
        var id = $clickedPost.data().id;
        var post = _findPostById(id);
        var comment = $(commentBtn).siblings('.comment-name').val();
        if (!('comments' in post)) {
            post.comments = [];
        }
        post.comments.push({ text: comment });
    }

    var renderComments = function (commentBtn) {
        var $clickedPost = $(commentBtn).closest('.post');
        var id = $clickedPost.data().id;
        var post = _findPostById(id);
        if (!('comments' in post)) {
            return '';
        }
        var commentList = '';
        for (var i = 0; i < post.comments.length; i++) {
            commentList += "<li><a href='#' class='fa fa-trash trash'></a>" + post.comments[i].text + "</li>";
        }
        $clickedPost.find('ul').empty();
        $clickedPost.find('ul').append(commentList);
    }

    var removeComment = function (removeCommentBtn) {
        var $clickedPost = $(removeCommentBtn).closest('.post');
        var id = $clickedPost.data().id;
        var post = _findPostById(id);
        var commentToRemove = $(removeCommentBtn).closest('li');
        post.comments.splice(commentToRemove.index(), 1);
    }


    return {
        createPost: createPost,
        renderPosts: renderPosts,
        removePost: removePost,
        createComment: createComment,
        renderComments: renderComments,
        removeComment: removeComment,
        toggleComments: toggleComments
    }
}

var app = SpacebookApp();

// immediately invoke the render method
app.renderPosts();

// Events
$('.add-post').on('click', function () {
    var text = $('#post-name').val();

    app.createPost(text);
    app.renderPosts();
});

$('.posts').on('click', '.remove', function () {
    app.removePost(this);
});

$('.posts').on('click', '.show-comments', function () {
    app.toggleComments(this);
});

$('.posts').on('click', '.add-comment', function () {
    app.createComment(this);
    app.renderComments(this);
});

$('.posts').on('click', '.trash', function () {
    app.removeComment(this);
    app.renderComments(this);
});

