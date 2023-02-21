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
    // TODO
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

    for (const user of data) {
        const html = `<div class="suggestion-card">
                        <img class="profile-picture" src="${user.image_url}" alt="${user.username}'s profile picture"/>
                        <div>
                            <p class="username">${user.username}</p>
                            <p class="subtext">suggested for you</p>
                        </div>
                        <button class="follow" type="button">follow</button>
                    </div>`;
        
        document.querySelector('.suggestion-card-container')
            .insertAdjacentHTML('beforeend', html);
    }
};

const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    const token = await getAccessToken(rootURL, 'webdev', 'password');
    const userData = await getUserData(token);

    // then use the access token provided to access data on the user's behalf
    navUsername(userData);
    showStories(token);
    showPosts(token);
    showCurrentUserInRightPanel(userData);
    showSuggestions(token);
};

initPage();
