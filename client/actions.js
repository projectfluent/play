import { get, post } from './api';

export function toggle_panel(name) {
    return {
      type: 'TOGGLE_PANEL',
      name
    };
}

export function change_messages(value) {
    return {
      type: 'CHANGE_MESSAGES',
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

export function change_variables(value) {
    return {
      type: 'CHANGE_VARIABLES',
      value
    };
}

export function fetch_gist(id) {
    return async function(dispatch) {
        dispatch({ type: 'REQUEST_GIST_FETCH' });

        try {
            var gist = await get(`/playgrounds/${id}`);
        } catch(error) {
            return dispatch({ type: 'ERROR_GIST_FETCH', error });
        }

        dispatch({ type: 'RECEIVE_GIST_FETCH', gist });
    };
}

export function create_gist() {
    return async function(dispatch, getState) {
        dispatch({ type: 'REQUEST_GIST_CREATE' });

        const { messages, variables, locale, dir } = getState();
        const body = {
            messages,
            variables,
            setup: { locale, dir, }
        };

        try {
            var response = await post('/playgrounds', body);
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
