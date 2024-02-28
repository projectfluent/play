import { get } from './api';
import { parse_link } from './link';

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

export function open_link(link) {
    try {
        const body = parse_link(link);
        return { type: 'OPEN_LINK', body };
    } catch (error) {
        return { type: 'ERROR_OPEN_LINK', error };
    }
}

export function toggle_link() {
    return { type: 'TOGGLE_LINK' };
}

export function reset_all() {
    window.history.replaceState({ gist: null }, document.title, '?');
    return {
      type: 'RESET_ALL'
    };
}
