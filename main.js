var SpacebookApp = function () {
  // dummy data

  var STORAGE_ID = 'spacebook';
  
  var saveToLocalStorage = function () {
    localStorage.setItem(STORAGE_ID, JSON.stringify(posts));
  }

  var getFromLocalStorage = function () {
            return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
  
  }

  var posts = getFromLocalStorage();

  

  // render posts to page
  // this function empties the posts div, 
  // then adds each post them from the posts array 
  // along with the appropriate HTML
  var _renderPosts = function () {
    // variable for storing our posts div
    
    var $posts = $('.posts');

    $posts.empty();
    for (var i = 0; i < posts.length; i += 1) {
      var post = posts[i];
      var commentsContainer = '<div class="comments-container">' + '<ul class=comments-list></ul>' +
        '<input type="text" class="comment-name">' +
        '<button class="btn btn-sm btn-primary add-comment">Post Comment</button> </div>';

      $posts.append('<li class="post">' +
        '<a href="#" class="show-comments">Toggle Comments </a> ' +
        post.text + '<button class="btn btn-danger btn-sm remove">Remove Post</button> ' + commentsContainer + '</li>');
    }
  }

  var _renderComments = function () {
    //empty all the comments - from all posts!!!
    $('.comments-list').empty();
    for (var i = 0; i < posts.length; i += 1) {
      // the current post in the iteration
      var post = posts[i];

      // finding the "post" element in the page that is "equal" to the
      // current post we're iterating on
      var $post = $('.posts').find('.post').eq(i);

      // iterate through each comment in our post's comments array
      for (var j = 0; j < post.comments.length; j += 1) {
        // the current comment in the iteration
        var comment = post.comments[j];

        // append the comment to the post we wanted to comment on
        $post.find('.comments-list').append(
          '<li class="comment">' + comment.text +
          '<button class="btn btn-danger btn-sm remove-comment">Remove Comment</button>' +
          '</li>'
        );
      };
    };
  };

  // build a single post object and push it to array
  var createPost = function (text) {
    posts.push({ text: text, comments: [] });
    saveToLocalStorage();
    _renderPosts();
    _renderComments();
  };

  var removePost = function ($clickedPost, index) {
    posts.splice(index, 1);
    saveToLocalStorage();
    $clickedPost.remove();
  };

  var createComment = function (text, postIndex) {
    var comment = { text: text };

    // pushing the comment into the correct posts array
    posts[postIndex].comments.push(comment);
    saveToLocalStorage();
    //render comments
    _renderComments();
  };

  var removeComment = function ($clickedComment, commentIndex, postIndex) {
    // remove the comment from the comments array on the correct post object
    posts[postIndex].comments.splice(commentIndex, 1);
    saveToLocalStorage();
    // removing the comment from the page
    $clickedComment.remove();
  };

  //  invoke the render method on app load
  _renderPosts();
  _renderComments();

  return {
    createPost: createPost,
    removePost: removePost,
    createComment: createComment,
    removeComment: removeComment
  };
};

var app = SpacebookApp();

// Event Handlers below

$('.add-post').on('click', function (e) {
  var text = $('#post-name').val();
  app.createPost(text);
});

$('.posts').on('click', '.remove', function () {
  var $clickedPost = $(this).closest('.post');
  var index = $clickedPost.index();

  app.removePost($clickedPost, index);
});

$('.posts').on('click', '.add-comment', function () {
  var text = $(this).siblings('.comment-name').val();
  // finding the index of the post in the page... will use it in #createComment
  var postIndex = $(this).closest('.post').index();

  app.createComment(text, postIndex);
});

$('.posts').on('click', '.remove-comment', function () {
  // the comment element that we're wanting to remove
  var $clickedComment = $(this).closest('.comment');
  // index of the comment element on the page
  var commentIndex = $clickedComment.index();
  // index of the post in the posts div that the comment belongs to
  var postIndex = $clickedComment.closest('.post').index();

  app.removeComment($clickedComment, commentIndex, postIndex);
});

$('.posts').on('click', '.show-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost.find('.comments-container').toggleClass('show');
});
