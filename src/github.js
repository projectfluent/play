import { PlaygroundError } from './error';

const GITHUB_API = 'https://api.github.com';

export async function get(endpoint) {
    const response = await fetch(`${GITHUB_API}${endpoint}`, {
        method: 'GET',
        headers: new Headers({
            'Accept': 'application/vnd.github.v3+json',
        })
    });

    return validate(response);
}

export async function post(endpoint, body) {
    const response = await fetch(`${GITHUB_API}${endpoint}`, {
        method: 'POST',
        headers: new Headers({
            'Accept': 'application/vnd.github.v3+json',
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

    throw new PlaygroundError(
        'NETWORK_ERROR',
        response.statusText,
        response
    );
}

export function validate_gist(gist) {
    const { files } = gist;
    if (!(('playground.ftl' in files) && ('playground.json' in files))) {
        throw new PlaygroundError(
            'FIXTURE_ERROR',
            'Required files missing'
        );
    }
}
