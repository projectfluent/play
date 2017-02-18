import { request } from './github';

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
        dispatch({ type: 'REQUEST_GIST' });

        try {
            var gist = await request('GET', `/gists/${id}`);
        } catch(error) {
            return dispatch({ type: 'ERROR_GIST', error });
        }

        dispatch({ type: 'RECEIVE_GIST', gist });
    };
}

export function reset_all() {
    history.replaceState({ gist: null }, document.title, '?');
    return {
      type: 'RESET_ALL'
    };
}
