export function suggestionToHTML(suggestion) {
    return `<div class="suggestion-card">
                <img class="profile-picture" src="${suggestion.image_url}" alt="${suggestion.username}'s profile picture"/>
                <div>
                    <p class="username">${suggestion.username}</p>
                    <p class="subtext">suggested for you</p>
                </div>
                <button class="follow" type="button">follow</button>
            </div>`;
};