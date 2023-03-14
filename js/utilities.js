/**
 * Sets a cookie which holds the access token after the user
 * "logs in." This is NOT secure. We will implement a more
 * secure approach in the latter half of the semester.
 *
 * @param {string} rootURL: The base address of the API
 * @param {string} username: Your username for the course API
 * @param {string} password: Your password for the course API
 */

const rootURL = 'https://photo-app-secured.herokuapp.com';
const token = await getAccessToken(rootURL, 'hayden', 'hayden_password');
export const currentUserData = await getCurrentUserData();

async function getAccessToken(rootURL, username, password) {
    const postData = {
        username: username,
        password: password,
    };
    const endpoint = `${rootURL}/api/token/`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    const data = await response.json();
    return data.access_token;
}

export async function getDataFromEndpointAsJSON(endpoint) {
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

async function getCurrentUserData() {
    const endpoint = `/api/profile`;
    return await getDataFromEndpointAsJSON(endpoint);
}

export async function postLikeToEndpoint(endpoint, body) {
    const url = `${rootURL}${endpoint}`;

    const headers = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify(body),
    };
    const response = await fetch(url, headers);
    const data = await response.json();
    return data;
}

export async function deleteLikeFromEndpoint(endpoint) {
    const url = `${rootURL}${endpoint}`;

    const headers = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
        },
    };
    const response = await fetch(url, headers);
    const data = await response.json();
    return data;
}