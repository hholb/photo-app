import { getAccessToken } from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';


const getUserData = async (token) => {
    const endpoint = `${rootURL}/api/profile`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });
    const data = await response.json();
    return data;
};

const storyToHTML = story => {
    return `
        <div class="story-card">
            <img class="profile-picture" src="${story.user.thumb_url}" alt="profile picture">
            <p class="username">${story.user.username}</p>
        </div>`;
};

const showStories = async (token) => {
    const endpoint = `${rootURL}/api/stories`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await response.json();
    console.log('Stories:', data);

    const html = data.map(storyToHTML).join('')

    const targetElem = document.querySelector('#stories-panel');
    targetElem.innerHTML = html;

};

const getMostRecentCommentAsHTML = post => {
    const commentIndex = (post.comments.length > 0) ? post.comments.length - 1 : 0;
    const comment = post.comments[commentIndex];
    if (comment) {
        return `
            <div class="comment">
                <p><span class="username">${comment.user.username}</span>
                    ${comment.text}
                </p>
                <p class="date">${comment.display_time}</p>
            </div>`;
    } else {
        return '';
    }
};

const postToHTML = post => {
    return `
        <div class="post">
            <header>
                <h1 class="username">${post.user.username}</h1>
                <i class="fas fa-ellipsis-h fa-lg"></i>
            </header>
            <img class="main image" src="${post.image_url}" alt="${post.alt_text}">
            <div class="caption-area">
                <div class="interactions">
                    <div class="like-share">
                        <button><i class="far fa-heart fa-lg"></i></button>
                        <button><i class="far fa-comment fa-lg"></i></button>
                        <button><i class="far fa-paper-plane fa-lg"></i></button>
                    </div>
                    <div class="bookmark">
                        <button><i class="far fa-bookmark fa-lg"></i></button>
                    </div>
                </div>
                <div class="likes">
                    <p>${post.likes.length} likes</p>
                </div>
                <div class="caption">
                    <p>
                        <span class="username">${post.user.username}</span>
                        ${post.caption}
                    </p>
                </div>
                <div class="comment-area">
                    <div class="comments">
                        ${getMostRecentCommentAsHTML(post)}
                        <div>
                            <button>Show all ${"TODO"} comments...</button>
                        </div>
                    </div>
                    <div class="add-comment-area">
                        <div class="write-comment">
                            <i class="far fa-grin fa-lg"></i>
                            <input class="comment-input" type="text" placeholder="Add a comment..." title="Add a comment">
                        </div>
                        <button>Post</butotn>
                    </div>
                </div>
            </div>
        </div>`;
};

const showPosts = async (token) => {
    const endpoint = `${rootURL}/api/posts`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await response.json();
    console.log('Posts:', data);

    const html = data.map(postToHTML).join('');
    document.querySelector('#posts-container')
        .insertAdjacentHTML('beforeend', html)
};

const showCurrentUserInRightPanel = (userData) => {
    const html = `<img class="profile-picture" src="${userData.image_url}" alt="profile picture"\>
                <h2>${userData.username}</h2>`;

    document.querySelector('#recommendations-panel .current-user')
        .insertAdjacentHTML('beforeend', html);
};

const navUsername = (userData) => {
    const html = `${userData.username}`;
    document.querySelector('.current-username')
        .insertAdjacentHTML('beforeend', html);
};

const suggestionToHTML = suggestion => {
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
    const endpoint = `${rootURL}/api/suggestions`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    });

    const data = await response.json();
    console.log("Suggestions:", data);

    const html = data.map(suggestionToHTML).join('');
    document.querySelector('#suggestion-card-container')
        .innerHTML = html;
};

const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    const token = await getAccessToken(rootURL, 'webdev', 'password');
    const userData = await getUserData(token);

    // then use the access token provided to access data on the user's behalf
    navUsername(userData);
    showCurrentUserInRightPanel(userData);

    showStories(token);
    showPosts(token);
    showSuggestions(token);
};

initPage();
