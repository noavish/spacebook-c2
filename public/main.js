// SpaceBook module
var SpacebookApp = function() {

    var posts = [];
    var $posts = $(".posts");

    // Getting all the posts and comments from the DB
    var fetch = function () {
        $.ajax({
            method: "GET",
            url: 'posts',
            datatype: "json",
            success: function (data) {
                console.log(data);
                posts = data;
                _renderPosts();
                $('[data-toggle="popover"]').popover();
                $('.comments-container').toggleClass('show');
            }, error: function (jqXHR, testStatus) {
                console.log(testStatus);
            }
        });
    };

    // Calling fetch
    fetch();

    // Update the posts view
    function _renderPosts() {
        console.log(posts.length);
        $posts.empty();
        var source = $('#post-template').html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < posts.length; i++) {
            var newHTML = template(posts[i]);
            console.log(newHTML);
            $posts.append(newHTML);
            _renderComments(i)
        }
    }

    // Update the comments view per post according to postID
    function _renderComments(postIndex) {
        var post = $(".post")[postIndex];
        $commentsList = $(post).find('.comments-list');
        $commentsList.empty();
        var source = $('#comment-template').html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < posts[postIndex].comments.length; i++) {
            var newHTML = template(posts[postIndex].comments[i]);
            $commentsList.append(newHTML);
        }
    }

    //Get new post text and add a new post object to the DB and to the view
    function addPost(newPost) {
        $.ajax({
            type: "POST",
            url: 'posts',
            data: {postText: newPost},
            success: function (data) {
                console.log('server returned a success response (HTTP response with status 200)');
                posts.push(data);
                _renderPosts();
            },
            error: function (jqXHR, testStatus) {
                console.log(testStatus);
            },
            dataType: 'json'
        });
    }

    //Get postIndex and postID and remove the post object from the DB and from the view
    var removePost = function(id, postIndex) {
        $.ajax({
            type: "DELETE",
            url: `posts/${id}`,
            success: function () {
                console.log('Delete');
                posts.splice(postIndex, 1);
                _renderPosts();
            },
            error: function (jqXHR, testStatus) {
                console.log(testStatus);
            }
        });
    };

    //Get a newComment object, postID and postIndex and add a new comment to the correct post in the DB and the view
    var addComment = function(newComment, id, postIndex) {
        console.log(newComment);
        $.ajax({
            type: "POST",
            url: `posts/${id}/comments/newComment`,
            data: newComment,
            success: function (data) {
                console.log(data);
                newComment._id = data.newCommentId;
                posts[postIndex].comments.push(newComment);
                _renderComments(postIndex);
            },
            error: function (jqXHR, testStatus) {
                console.log(testStatus);
            },
            dataType: 'json'
        });
    };

    // Get postID and postIndex and commentId and commentIndex and remove the right comment from the right post in DB and view
    var deleteComment = function(commentID, postID, postIndex, commentIndex) {
        $.ajax({
            type: "DELETE",
            url: `posts/${postID}/comments/removeComment`,
            data: {commentID: commentID},
            success: function () {
                console.log('Delete');
                posts[postIndex].comments.splice(commentIndex, 1);
                _renderComments(postIndex);
            },
            error: function (jqXHR, testStatus) {
                console.log(testStatus);
            }
        });
    };

    var findPostID = function (clickedElement) {
        return clickedElement.closest('.post').data().id;
    };

    var updatePost = function (postID, postIndex, newText) {
        $.ajax({
            type: "PUT",
            url: `posts/${postID}/updatePost`,
            data: {
                postText:newText
            },
            success: function (data) {
                console.log(data);
                console.log(posts);
                console.log(postIndex);
                posts[postIndex].postText = data;
                _renderPosts();
            },
            error: function (jqXHR, testStatus) {
                console.log(testStatus);
            }
        });
    };

    var changeCommentsOrder = function (postID, newIndex, oldIndex) {
        $.ajax({
            type: "PUT",
            url: `posts/${postID}/comments/sort`,
            data: {
                newIndex: newIndex,
                oldIndex: oldIndex
            },
            success: function (data) {
                console.log(data);
                posts[postIndex].comments = data;
                _renderComments();
            },
            error: function (jqXHR, testStatus) {
                console.log(testStatus);
            }
        })
    };

    //return functions out of the module
    return {
        addPost: addPost,
        removePost: removePost,
        addComment: addComment,
        deleteComment: deleteComment,
        findPostID: findPostID,
        updatePost, updatePost,
        changeCommentsOrder: changeCommentsOrder
    };
};

var $posts = $(".posts");
var app = SpacebookApp();

// Click the addPost - calling the addPost function and clear the fields
$('#addpost').on('click', function() {
    debugger
    var $input = $("#postText");
    if ($input.val() === "") {
    alert("Please enter text!");
    } else {
    app.addPost($input.val());
    $input.val("");
    }
});

// Click the removePost - calling the removePost function
$posts.on('click', '.remove-post', function() {
    var id = app.findPostID($(this));
    var postIndex = $(this).closest('.post').index();
    app.removePost(id, postIndex);
});

// Click the Comments - toggling the comments list (show/hide)
$posts.on('click', '.toggle-comments', function() {
    var $clickedPost = $(this).closest('.post');
    $clickedPost.find('.comments-container').toggleClass('show');
});

// Click the addComment - calling the addComment function and clear the fields
$posts.on('click', '.add-comment', function() {
    var id = app.findPostID($(this));
    var $comment = $(this).siblings('.comment');
    var $user = $(this).siblings('.name');

    if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
    }
    var postIndex = $(this).parents('.post').index();
    var newComment = { comment: $comment.val(), userName: $user.val() };

    app.addComment(newComment, id, postIndex);

    $comment.val("");
    $user.val("");
});

// Click the removeComment - calling the deleteComment function
$posts.on('click', '.remove-comment', function() {
    var postID = app.findPostID($(this));
    var commentID = $(this).closest('li').data().id;
    var postIndex = $(this).closest('.post').index();
    var commentIndex = $(this).closest('.comment').index();

    app.deleteComment(commentID, postID, postIndex, commentIndex);
});


// Click to updatePost - calling the updatePost function
$posts.on('click', '.update-post', function () {
    // var postID = app.findPostID($(this));
    var postText = $(this).parents('.post').children('span').text();
    $(this).parents('.post').children('span').html(`<input type='text' class='change-text' value=${postText}>`);
});

$posts.on('keyup', '.change-text', function(event) {
    if (event.keyCode == 13 || event.which == 13) {
        var postID = app.findPostID($(this));
        var postIndex = $(this).parents('.post').index();
        var newText = $(this).val();
        $(this).parents('.post').html(`<span>${newText}</span>`);
        app.updatePost(postID, postIndex, newText);
    }
});

var oldIndex = 0;
// $('.posts').on('dragstart', '.comment-li', function () {
//     oldIndex = $(this).index();
// });
//
// $('.posts').on('dragend', '.comment-li', function () {
//    var newIndex = $(this).index();
//
//    }
// });

$(function() {
    $( "#sortable" ).sortable({
        start: function (err, ui) {
            oldIndex = ui.item.index();
        },
        update: function (event, ui) {
            var postID = app.findPostID($(this));
            var newIndex = ui.item.index();
            if (newIndex !== oldIndex) {
                app.changeCommentsOrder(postID, newIndex, oldIndex);
            }
        }
    });
    $( "#sortable" ).disableSelection();
});