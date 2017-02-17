const GITHUB_API = 'https://api.github.com';

export function toggle_panel(name) {
    return {
      type: 'TOGGLE_PANEL',
      name
    };
}

export function change_translations(value) {
    return {
      type: 'CHANGE_TRANSLATIONS',
      value
    };
}

export function change_externals(value) {
    return {
      type: 'CHANGE_EXTERNALS',
      value
    };
}

export function fetch_gist(id) {
    return async function(dispatch) {
        dispatch({
            type: 'REQUEST_GIST'
        });

        const url = `${GITHUB_API}/gists/${id}`;
        const response = await fetch(url);

        if (!response.ok) {
            return dispatch({
                type: 'ERROR_GIST'
            });
        }

        const gist = await response.json();
        dispatch({
            type: 'RECEIVE_GIST',
            gist
        });
    };
}

export function reset_all() {
    history.replaceState({ gist: null }, document.title, '?');
    return {
      type: 'RESET_ALL'
    };
}
