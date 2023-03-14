export function postToHTML(post) {
    const currentUserId = document.querySelector('.current-username').getAttribute('data-current-user-id');
    return `
        <div id="post_${post.id}"class="post" data-post-id="${post.id}">
            <header>
                <h1 class="username">${post.user.username}</h1>
                <i class="fas fa-ellipsis-h fa-lg"></i>
            </header>
            <img class="main image" src="${post.image_url}" alt="${post.alt_text}">
            <div class="interactions">
                <div class="like-share">
                    ${getLikeButton(post, currentUserId)}
                    <button class="icon"><i class="far fa-comment fa-lg"></i></button>
                    <button class="icon"><i class="far fa-paper-plane fa-lg"></i></button>
                </div>
                <div class="bookmark">
                    ${getBookmarkButton(post, currentUserId)}
                </div>
            </div>
            <div class="likes">
                <p>${post.likes.length} likes</p>
            </div>
            <div class="caption-area">
                <div class="caption">
                    <p>
                        <span class="username">${post.user.username}</span>
                        ${post.caption}
                    </p>
                </div>
                <div class="comment-area">
                    <div class="comments">
                        ${getMostRecentCommentAsHTML(post)}
                        <div class="more-comments">
                            ${getMoreCommentsButtonHTML(post)}
                        </div>
                    </div>
                </div>
                <div class="add-comment-area">
                    <div class="write-comment">
                        <button class="icon emoji"><i class="far fa-grin fa-lg"></i></button>
                        <input class="comment-input" type="text" placeholder="Add a comment..." title="Add a comment">
                    </div>
                    <button class="post-comment">Post</button>
                </div>
                </div>
            </div>
        </div>
    `;
}

function getMostRecentCommentAsHTML(post) {
    const commentIndex =
        post.comments.length > 0 ? post.comments.length - 1 : 0;
    const comment = post.comments[commentIndex];
    if (comment) {
        return `
            <div class="comment">
                <p><span class="username">${comment.user.username}</span>
                    ${comment.text}
                </p>
                <p class="comment-date">${comment.display_time}</p>
            </div>`;
    } else {
        return '';
    }
}

function getMoreCommentsButtonHTML(post) {
    const numComments = post.comments.length;
    const html =
        numComments > 1
            ? `<button class="show-comments" data-post-id="${post.id}">Show all ${numComments} comments...</button>`
            : '';
    return html;
}

function getLikeButton(post, currentUserId) {
    const isLiked = post.likes.find(
        (like) => like.user_id == currentUserId
    );
    const icon = isLiked ? 'fas' : 'far';
    const handler = isLiked ? 'unlikePost' : 'likePost';
    const likeId = isLiked ? isLiked.id : '';
    return `<button class="icon like" data-liked=${(isLiked) ? "true" : "false"} data-post-id="${post.id}" data-like-id="${likeId}" onclick="${handler}(event)"><i class="${icon} fa-heart fa-lg"></i></button>`;
}

function getBookmarkButton(post, currentUserId) {
    console.log(post);
    const isBookmarked = post.current_user_bookmark_id;
    const icon = isBookmarked ? 'fas' : 'far';
    const handler = isBookmarked ? 'unbookmarkPost' : 'bookmarkPost';
    const bookmarkId = isBookmarked ? isBookmarked : '';
    return `<button class="icon bookmark" data-bookmarked=${(isBookmarked) ? "true" : "false"} data-post-id="${post.id}" data-bookmark-id="${bookmarkId}" onclick="${handler}(event)"><i class="${icon} fa-bookmark fa-lg"></i></button>`;
}