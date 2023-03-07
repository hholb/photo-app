import { getAccessToken } from './utilities.js';
import { storyToHTML } from './storyHTML.js';
import { postToHTML } from './postHTML.js';
import { suggestionToHTML } from './suggestionHTML.js';

const rootURL = 'https://photo-app-secured.herokuapp.com';
const token = await getAccessToken(rootURL, 'hayden', 'hayden_password');
const currentUserData = await getCurrentUserData();
const modalBackground = document.querySelector('#modal-bg');

async function getCurrentUserData() {
    const endpoint = `/api/profile`;
    const data = await getDataFromEndpointAsJSON(endpoint);
    return data;
}

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
    const html = `${currentUserData.username}`;
    document
        .querySelector('.current-username')
        .insertAdjacentHTML('beforeend', html);
}

async function initStoriesPanel() {
    const storiesJSON = await getStoiresData();
    const storiesHTML = getStoriesAsHTML(storiesJSON);
    displayStories(storiesHTML);
}

async function getStoiresData() {
    const endpoint = `/api/stories`;
    const data = await getDataFromEndpointAsJSON(endpoint);
    console.log('Stories:', data);
    return data;
}

function getStoriesAsHTML(storiesData) {
    const html = storiesData.map(storyToHTML).join('');
    return html;
}

function displayStories(storiesHTML) {
    const targetElem = document.querySelector('#stories-panel');
    targetElem.innerHTML = storiesHTML;
}

async function initRightPanel() {
    displayCurrentUserInRightPanel();
    const suggestionsJSON = await getSuggestionsData();
    const suggestionsHTML = getSuggestionsAsHTML(suggestionsJSON);
    displaySuggestions(suggestionsHTML);
}

async function getSuggestionsData() {
    const endpoint = `/api/suggestions`;
    const data = await getDataFromEndpointAsJSON(endpoint);
    console.log('Suggestions:', data);
    return data;
}

function getSuggestionsAsHTML(suggestions) {
    const html = suggestions.map(suggestionToHTML).join('');
    return html;
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
}

async function getPostJSON() {
    const endpoint = `/api/posts`;
    const data = await getDataFromEndpointAsJSON(endpoint);
    console.log('Posts:', data);
    return data;
}

function getPostHTML(postJSON) {
    const html = postJSON.map(postToHTML).join('');
    return html;
}

function displayPosts(postHTML) {
    document
        .querySelector('#posts-container')
        .insertAdjacentHTML('beforeend', postHTML);
}

window.showModalPost = async (postId) => {
    const endpoint = `/api/posts/${postId}`;
    const data = await getDataFromEndpointAsJSON(endpoint);
    const html = modalPostToHTML(data);
    document.querySelector('#modal').innerHTML = html;
    modalBackground.classList = 'modal-show';
    modalBackground.setAttribute('aria-hidden', 'false');
    document.querySelector('#modal-close').focus();
};

window.hideModal = () => {
    modalBackground.classList = 'hidden';
    modalBackground.setAttribute('aria-hidden', 'true');
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

const getCommentsHTML = (commentArray) => {
    let html;
    if (commentArray) {
        html = commentArray.map(commentToHTML).join('');
    }
    return html;
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

async function getDataFromEndpointAsJSON(endpoint) {
    const url = `${rootURL}${endpoint}`;

    const headers = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };

    const response = await fetch(url, headers);

    const data = await response.json();
    return data;
}

initPage();
