var posts = [];
var randomID = 1;

//create and push new posts
function newPost(postName) {
    posts.push({ postName: postName, postID: randomID, commentsList: [] });
    randomID++;
};

function newComment(postID, userName, comment) {
    var post = findPost(postID);
    post.commentsList.push({ userName: userName, comment: comment });
};

function removePosts (postID) {
    for (var i = 0; i < posts.length; i++) {
        if (posts[i].postID === postID) {
            posts.splice(i, 1);
            renderPosts();
            return;
        }
    }
};

function removeComment(post, commentToRemove) {
    post.commentsList.splice(commentToRemove.index(), 1);
    renderPosts();
    return;
};

function findPost(id) {
    for (var i = 0; i < posts.length; i++) {
        if (posts[i].postID === id) {
            return posts[i];
        }
    }
};

function getCommentsHTML(comments){
    var htmlComments = '<ul>';
    for (let n = 0; n <comments.length; n++) {
        htmlComments += `<li>
                            <button type="button" class="remove-comment">Remove Comment</button>
                            <span>${comments[n].userName} </span> 
                            ${comments[n].comment} 
                        </li>`;
    }
    return htmlComments +'</ul>';
};

function renderPosts() {
    $('.posts').find('.post').remove();
    for (let i = 0; i < posts.length; i++) {
        $('.posts').append(`<div class='post' data-id='${posts[i].postID}'> 
                                <button type="button" class="remove">Remove</button> 
                                <span>
                                    ${posts[i].postName} 
                                </span>
                                <form> 
                                    <input name='userName' type='text' required> 
                                    <input name='comment' type='text' required>
                                    <button type='button' class='post-comment'> Post Comment </button>
                                </form>
                                ${getCommentsHTML(posts[i].commentsList)}
                            </div>`);
    }
};

$('.add-post').click(function () {
    newPost($('#post-name').val());
    renderPosts();
});

$('.posts').on('click', '.remove', function () {
    var postID = $(this).parents('.post').data().id;
    removePosts(postID);
});

$('.posts').on('click', '.post-comment', function () {
    var postID = $(this).parents('.post').data().id;
    var userName = $(this).siblings('input[name=userName]').val();
    var comment = $(this).siblings('input[name=comment]').val();
    newComment(postID, userName, comment);
    renderPosts();
    return;
});

$('.posts').on('click', '.remove-comment', function () {
    var postID = $(this).parents('.post').data().id;
    var commentToRemove = $(this).closest('li');
    var post = findPost(postID);
    removeComment(post, commentToRemove);
});

