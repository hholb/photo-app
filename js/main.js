import {getAccessToken} from './utilities.js';
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
}

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

    const targetElem = document.querySelector('.stories-panel');
    targetElem.innerHTML = html;

};

const showPosts = async (token) => {
    // TODO
    console.log('code to show posts');
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
}

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
    document.querySelector('.suggestion-card-container')
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
