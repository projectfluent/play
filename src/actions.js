import { get, post } from './github';

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

export function change_locale(value) {
    return {
      type: 'CHANGE_LOCALE',
      value
    };
}

export function change_dir(value) {
    return {
      type: 'CHANGE_DIR',
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
        dispatch({ type: 'REQUEST_GIST_FETCH' });

        try {
            var gist = await get(`/gists/${id}`);
        } catch(error) {
            return dispatch({ type: 'ERROR_GIST_FETCH', error });
        }

        dispatch({ type: 'RECEIVE_GIST_FETCH', gist });
    };
}

export function create_gist() {
    return async function(dispatch, getState) {
        dispatch({ type: 'REQUEST_GIST_CREATE' });

        const { translations, externals_string, locale, dir } = getState();
        const setup = { locale, dir };

        const body = {
            'description': 'A Fluent Playground example',
            'public': true,
            'files': {
                'playground.ftl': {
                  'content': translations
                },
                'playground.json': {
                  'content': externals_string
                },
                'setup.json': {
                  'content': JSON.stringify(setup, null, 4)
                },
            }
        };

        try {
            var response = await post('/gists', body);
        } catch(error) {
            return dispatch({ type: 'ERROR_GIST_CREATE', error });
        }

        dispatch({ type: 'RECEIVE_GIST_CREATE', response });
    };
}

export function reset_all() {
    window.history.replaceState({ gist: null }, document.title, '?');
    return {
      type: 'RESET_ALL'
    };
}
