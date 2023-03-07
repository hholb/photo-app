export function storyToHTML(story) {
    return `
        <div class="story-card">
            <img class="profile-picture" src="${story.user.image_url}"
             alt="profile picture">
            <p class="username">${story.user.username}</p>
        </div>
    `;
}
