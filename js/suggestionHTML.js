export function suggestionToHTML(suggestion) {
    return `<div class="suggestion-card">
                <img class="profile-picture" src="${suggestion.image_url}" alt="${suggestion.username}'s profile picture"/>
                <div>
                    <p class="username">${suggestion.username}</p>
                    <p class="subtext">suggested for you</p>
                </div>
                ${getFollowButton(suggestion)}
            </div>`;
};

function getFollowButton(suggestion) {
    const usersFollowed = getFollowedUsers();
    console.log(suggestion);
    return usersFollowed.includes(suggestion.id) ? '<button class="follow" type="button" onclick="unfollow(event)">unfollow</button>' : '<button class="follow" type="button" onclick="follow(event)">follow</button>';
}

function getFollowedUsers() {
    const followedUsers = localStorage.getItem('followedUsers');
    return followedUsers ? JSON.parse(followedUsers) : [];
};