import { getAccessToken } from './utilities.js';

const rootURL = 'https://photo-app-secured.herokuapp.com';
const token = await getAccessToken(rootURL, 'hayden', 'hayden_password');
const modalElement = document.querySelector('#modal-bg');

const getDataFromEndpointAsJSON = async (endpoint) => {
    const url = `${rootURL}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    });

    const data = await response.json();
    return data;
};

const getUserData = async () => {
    const endpoint = `/api/profile`;
    const data = await getDataFromEndpointAsJSON(endpoint);
    return data;
};

const storyToHTML = (story) => {
    return `
        <div class="story-card">
            <img class="profile-picture" src="${story.user.image_url}"
             alt="profile picture">
            <p class="username">${story.user.username}</p>
        </div>`;
};

const getStoires = async () => {
    const endpoint = `/api/stories`;
    const data = await getDataFromEndpointAsJSON(endpoint);
    console.log('Stories:', data);
    return data;
};

const showStories = (storiesData) => {
    const html = storiesData.map(storyToHTML).join('');
    const targetElem = document.querySelector('#stories-panel');
    targetElem.innerHTML = html;
};

const getMostRecentCommentAsHTML = (post) => {
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
};

const getMoreCommentsButtonHTML = (post) => {
    const numComments = post.comments.length;
    const html =
        numComments > 1
            ? `<button class="show-comments" onclick="showModalPost(${post.id})">Show all ${numComments} comments...</button>`
            : '';
    return html;
};

window.showModalPost = async (postId) => {
    const endpoint = `${rootURL}/api/posts/${postId}`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    });

    const data = await response.json();
    const html = modalPostToHTML(data);
    document.querySelector('#modal').innerHTML = html;
    modalElement.classList = 'modal-show';
    modalElement.setAttribute('aria-hidden', 'false');
    document.querySelector('#modal-close').focus();
};

window.hideModal = () => {
    modalElement.classList = 'hidden';
    modalElement.setAttribute('aria-hidden', 'true');
};

const postToHTML = (post) => {
    return `
        <div id="post_${post.id}"class="post" data-post-id="${post.id}">
            <header>
                <h1 class="username">${post.user.username}</h1>
                <i class="fas fa-ellipsis-h fa-lg"></i>
            </header>
            <img class="main image" src="${post.image_url}" alt="${
        post.alt_text
    }">
            <div class="interactions">
                <div class="like-share">
                    <button class="icon"><i class="far fa-heart fa-lg"></i></button>
                    <button class="icon"><i class="far fa-comment fa-lg"></i></button>
                    <button class="icon"><i class="far fa-paper-plane fa-lg"></i></button>
                </div>
                <div class="bookmark">
                    <button class="icon"><i class="far fa-bookmark fa-lg"></i></button>
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
        </div>`;
};

const modalPostToHTML = (post) => {
    return `
    <button id="modal-close" class="icon" onclick="hideModal()"><i class="fa-solid fa-x"></i></button>
    <div class="modal-body">
        <div class="image" style="background-image: url('${
            post.image_url
        }');"></div>
        <div class="modal-comment-area">
            <h2 class="username">${post.user.username}</h2>
            <div class="modal-comments">
                ${getCommentsHTML(post.comments)}
            </div>
        </div>
    </div>`;
};

const commentToHTML = (comment) => {
    return `
    <div class="modal-comment">
        <p><span class="username">${comment.user.username}</span> ${comment.text}</p>
        <p class="comment-date">${comment.display_time}</p>
    </div>`;
};

window.getCommentsHTML = (commentArray) => {
    let html;
    if (commentArray) {
        html = commentArray.map(commentToHTML).join('');
    }
    return html;
};

const showPosts = async (token) => {
    const endpoint = `${rootURL}/api/posts`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    });

    const data = await response.json();
    console.log('Posts:', data);

    const html = data.map(postToHTML).join('');
    document
        .querySelector('#posts-container')
        .insertAdjacentHTML('beforeend', html);
};

const showCurrentUserInRightPanel = (userData) => {
    const html = `<img class="profile-picture" src="${userData.image_url}" alt="profile picture"\>
                <h2>${userData.username}</h2>`;

    document
        .querySelector('#recommendations-panel .current-user')
        .insertAdjacentHTML('beforeend', html);
};

const navUsername = (userData) => {
    const html = `${userData.username}`;
    document
        .querySelector('.current-username')
        .insertAdjacentHTML('beforeend', html);
};

const suggestionToHTML = (suggestion) => {
    return `<div class="suggestion-card">
                <img class="profile-picture" src="${suggestion.image_url}" alt="${suggestion.username}'s profile picture"/>
                <div>
                    <p class="username">${suggestion.username}</p>
                    <p class="subtext">suggested for you</p>
                </div>
                <button class="follow" type="button">follow</button>
            </div>`;
};

const showSuggestions = async (token) => {
    const endpoint = `/api/suggestions`;
    const data = await getDataFromEndpointAsJSON(endpoint);
    console.log('Suggestions:', data);

    const html = data.map(suggestionToHTML).join('');
    document.querySelector('#suggestion-card-container').innerHTML = html;
};

document.addEventListener(
    'focus',
    function (event) {
        console.log('focus');
        if (
            modalElement.getAttribute('aria-hidden') === 'false' &&
            !modalElement.contains(event.target)
        ) {
            console.log('back to top!');
            event.stopPropagation();
            document.querySelector('#modal-close').focus();
        }
    },
    true
);

const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    const userData = await getUserData(token);

    // then use the access token provided to access data on the user's behalf
    navUsername(userData);
    showCurrentUserInRightPanel(userData);

    const stories = await getStoires();
    showStories(stories);
    showPosts(token);
    showSuggestions(token);
};

initPage();
