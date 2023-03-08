import { getDataFromEndpointAsJSON } from './utilities.js';
import { storyToHTML } from './storyHTML.js';
import { postToHTML } from './postHTML.js';
import { suggestionToHTML } from './suggestionHTML.js';
import { modalPostToHTML } from './modalHTML.js';

const currentUserData = await getCurrentUserData();

async function getCurrentUserData() {
    const endpoint = `/api/profile`;
    return await getDataFromEndpointAsJSON(endpoint);
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
