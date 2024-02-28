import { ServerError } from './error';

const SERVER_URL = 'https://fluent-play.herokuapp.com';

export async function get(endpoint) {
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'GET',
    });
    if (response.ok) {
        return response.json();
    }

    let message = (await response.json()).error;
    throw new ServerError(response.status, message);
}
