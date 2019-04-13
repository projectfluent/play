import { ServerError } from './error';

const SERVER_URL = 'https://fluent-play.herokuapp.com';

export async function get(endpoint) {
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'GET',
    });

    return validate(response);
}

export async function post(endpoint, body) {
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(body)
    });

    return validate(response);
}

async function validate(response) {
    if (response.ok) {
        return response.json();
    }

    let message = (await response.json()).error;
    throw new ServerError(response.status, message);
}
