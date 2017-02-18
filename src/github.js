import { PlaygroundError } from './error';

const GITHUB_API = 'https://api.github.com';

export async function request(method, endpoint) {
    const response = await fetch(`${GITHUB_API}${endpoint}`, {
        method,
        headers: new Headers({
            "Accept": "application/vnd.github.v3+json"
        })
    });

    if (response.ok) {
        return response.json();
    }

    throw new PlaygroundError(
        'FETCH_ERROR',
        response.statusText,
        response
    );
}

export function validate_gist(gist) {
    const { files } = gist;
    if (!(('playground.ftl' in files) && ('playground.json' in files))) {
        throw new PlaygroundError(
            'GIST_ERROR',
            'Required files missing'
        );
    }
}
