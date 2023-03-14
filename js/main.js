import {
    getDataFromEndpointAsJSON,
    currentUserData,
    postLikeToEndpoint,
    deleteLikeFromEndpoint,
    postBookmarkToEndpoint,
    deleteBookmarkFromEndpoint,
    followAccount,
    unfollowAccount,
    postCommentToEndpoint,
} from './utilities.js';
import { storyToHTML } from './storyHTML.js';
import { postToHTML } from './postHTML.js';
import { suggestionToHTML } from './suggestionHTML.js';
import { modalPostToHTML } from './modalHTML.js';

async function initPage() {
    initNavBar();
    initStoriesPanel();
    initRightPanel();
    initPosts();
}

function initNavBar() {
    displayCurrentUserInNavBar();
}

function displayCurrentUserInNavBar() {
    const html = getNavbarHTML();
    document.querySelector('nav').insertAdjacentHTML('beforeend', html);
}

function getNavbarHTML() {
    return `<h1 id="nav-logo"><a href="index.html">Photo App</a></h1>
            <div>
                <p data-current-user-id="${currentUserData.id}" class="current-username">${currentUserData.username}</p>
                <button class="sign-out">Sign out</button>
            </div>`;
}

async function initStoriesPanel() {
    const storiesJSON = await getStoiresData();
    const storiesHTML = getStoriesAsHTML(storiesJSON);
    displayStories(storiesHTML);
}

async function getStoiresData() {
    const endpoint = `/api/stories`;
    return await getDataFromEndpointAsJSON(endpoint);
}

function getStoriesAsHTML(storiesData) {
    return storiesData.map(storyToHTML).join('');
}

function displayStories(storiesHTML) {
    document.querySelector('#stories-panel').innerHTML = storiesHTML;
}

async function initRightPanel() {
    displayCurrentUserInRightPanel();
    const suggestionsJSON = await getSuggestionsData();
    const suggestionsHTML = getSuggestionsAsHTML(suggestionsJSON);
    displaySuggestions(suggestionsHTML);
}

async function getSuggestionsData() {
    const endpoint = `/api/suggestions`;
    return await getDataFromEndpointAsJSON(endpoint);
}

function getSuggestionsAsHTML(suggestions) {
    return suggestions.map(suggestionToHTML).join('');
}

function displaySuggestions(suggestionsHTML) {
    document.querySelector('#suggestion-card-container').innerHTML =
        suggestionsHTML;
}

function displayCurrentUserInRightPanel() {
    const html = `<img class="profile-picture" src="${currentUserData.image_url}" alt="profile picture"\>
                <h2>${currentUserData.username}</h2>`;

    document
        .querySelector('#recommendations-panel .current-user')
        .insertAdjacentHTML('beforeend', html);
}

async function initPosts() {
    const postsJSON = await getPostJSON();
    const postsHTML = getPostHTML(postsJSON);
    displayPosts(postsHTML);
    addModalEventListener();
}

async function getPostJSON() {
    const endpoint = `/api/posts`;
    return await getDataFromEndpointAsJSON(endpoint);
}

function getPostHTML(postJSON) {
    return postJSON.map(postToHTML).join('');
}

function displayPosts(postHTML) {
    document
        .querySelector('#posts-container')
        .insertAdjacentHTML('beforeend', postHTML);
}

const modalBackground = document.querySelector('#modal-bg');

function addModalEventListener() {
    const posts = document.querySelectorAll('.show-comments');
    posts.forEach((post) => {
        post.addEventListener('click', window.displayModalPost);
    });
}

window.displayModalPost = async (event) => {
    const postId = event.currentTarget.getAttribute('data-post-id');
    document.querySelector('#modal').innerHTML = await window.getModalPostHTML(
        postId
    );
    modalBackground.classList = 'modal-show';
    modalBackground.setAttribute('aria-hidden', 'false');
    window.modalCloseButtonAddEventAndFocus();
};

window.getModalPostHTML = async (postId) => {
    const endpoint = `/api/posts/${postId}`;
    const data = await getDataFromEndpointAsJSON(endpoint);
    return modalPostToHTML(data);
};

window.modalCloseButtonAddEventAndFocus = () => {
    const closeButton = document.querySelector('#modal-close');
    closeButton.addEventListener('click', hideModal);
    closeButton.focus();
};

window.hideModal = () => {
    modalBackground.classList = 'hidden';
    modalBackground.setAttribute('aria-hidden', 'true');
};

window.likePost = async (event) => {
    const postId = event.currentTarget.getAttribute('data-post-id');
    const endpoint = `/api/posts/likes`;
    const body = { post_id: postId };
    const data = await postLikeToEndpoint(endpoint, body);
    redrawPost(postId);
};

window.unlikePost = async (event) => {
    const likeId = event.currentTarget.getAttribute('data-like-id');
    const postId = event.currentTarget.getAttribute('data-post-id');
    const endpoint = `/api/posts/likes/${likeId}`;
    const data = await deleteLikeFromEndpoint(endpoint);
    redrawPost(postId);
};

async function redrawPost(postId) {
    const postData = await getSinglePostJSON(postId);
    const postHTML = postToHTML(postData);
    document.querySelector(`#post_${postId}`).innerHTML = postHTML;
}

async function getSinglePostJSON(postId) {
    const endpoint = `/api/posts/${postId}`;
    return await getDataFromEndpointAsJSON(endpoint);
}

window.bookmarkPost = async (event) => {
    const postId = event.currentTarget.getAttribute('data-post-id');
    const endpoint = `/api/bookmarks`;
    const body = { post_id: postId };
    const data = await postBookmarkToEndpoint(endpoint, body);
    redrawPost(postId);
};

window.unbookmarkPost = async (event) => {
    const postId = event.currentTarget.getAttribute('data-post-id');
    const bookmarkId = event.currentTarget.getAttribute('data-bookmark-id');
    const endpoint = `/api/bookmarks/${bookmarkId}`;
    const data = await deleteBookmarkFromEndpoint(endpoint);
    redrawPost(postId);
};

window.follow = async (event) => {
    const userId = event.currentTarget.getAttribute('data-user-id');
    const endpoint = `/api/following`;
    const body = { user_id: userId };
    const data = await followAccount(endpoint, body);
    redrawSuggestion();
};

window.unfollow = async (event) => {
    const userId = event.currentTarget.getAttribute('data-user-id');
    const endpoint = `/api/following/${userId}`;
    const data = await unfollowAccount(endpoint);
    redrawSuggestion();
};

function redrawSuggestion() {}

window.postComment = async (event) => {
    const postId = event.currentTarget.getAttribute('data-post-id');
    const comment = document.querySelector(`#comment_${postId}`).value;
    const endpoint = `/api/comments`;
    const body = { post_id: postId, text: comment };
    const data = await postCommentToEndpoint(endpoint, body);
    redrawPost(postId);
};

document.addEventListener(
    'focus',
    function (event) {
        console.log('focus');
        if (
            modalBackground.getAttribute('aria-hidden') === 'false' &&
            !modalBackground.contains(event.target)
        ) {
            console.log('back to top!');
            event.stopPropagation();
            document.querySelector('#modal-close').focus();
        }
    },
    true
);

initPage();
