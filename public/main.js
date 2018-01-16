var SpacebookApp = function() {

    var posts = [];
    var $posts = $(".posts");

    var fetch = function () {
        $.ajax({
            method: "GET",
            url: 'posts',
            datatype: "json",
            success: function (data) {
                console.log(data);
                posts = data;
                _renderPosts();
            }, error: function (jqXHR, testStatus) {
                console.log(testStatus);
            }
        });
    };

    fetch();

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

    function addPost(newPost) {
        $.ajax({
            type: "POST",
            url: 'posts',
            data: {postText: newPost},
            success: function () {
                console.log('server returned a success response (HTTP response with status 200)');
            },
            error: function (jqXHR, testStatus) {
                console.log(testStatus);
            },
            dataType: 'json'
        });
        // posts.push({text: newPost, comments: [] });
        // _renderPosts();
        fetch();
    }


    function _renderComments(postIndex) {
        var post = $(".post")[postIndex];
        $commentsList = $(post).find('.comments-list')
        $commentsList.empty();
        var source = $('#comment-template').html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < posts[postIndex].comments.length; i++) {
            var newHTML = template(posts[postIndex].comments[i]);
            $commentsList.append(newHTML);
        }
    }

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

        var addComment = function(newComment, id, postIndex) {
            console.log(newComment);
            $.ajax({
                type: "POST",
                url: `posts/${id}/comments/newComment`,
                data: newComment,
                success: function (data) {
                    console.log(data);
                    posts[postIndex].comments.push(newComment);
                    _renderComments();
                },
                error: function (jqXHR, testStatus) {
                    console.log(testStatus);
                },
                dataType: 'json'
            });
        };


        var deleteComment = function(postIndex, commentIndex) {
            posts[postIndex].comments.splice(commentIndex, 1);
            _renderComments(postIndex);
        };

        return {
            addPost: addPost,
            removePost: removePost,
            addComment: addComment,
            deleteComment: deleteComment,
        };
    };

var $posts = $(".posts");
var app = SpacebookApp();


$('#addpost').on('click', function() {
      var $input = $("#postText");
      if ($input.val() === "") {
        alert("Please enter text!");
      } else {
        app.addPost($input.val());
        $input.val("");
      }
});

$posts.on('click', '.remove-post', function() {
  var id = $(this).closest('.post').data().id;
  var postIndex = $(this).closest('.post').index();
  app.removePost(id, postIndex);
});

$posts.on('click', '.toggle-comments', function() {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});

$posts.on('click', '.add-comment', function() {
  var id = $(this).parents('.post').data().id;
  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this).closest('.post').index();
  var newComment = { text: $comment.val(), user: $user.val() };

  app.addComment(newComment, id, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function() {
  var $commentsList = $(this).closest('.post').find('.comments-list');
  var postIndex = $(this).closest('.post').index();
  var commentIndex = $(this).closest('.comment').index();

  app.deleteComment(postIndex, commentIndex);
});
