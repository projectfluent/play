import * as defaults from './defaults';
import {
    parse_messages, create_bundle, format_messages, parse_variables,
} from './fluent';
import { build_link_url } from './link';

const locale = 'en-US';
const [ast, annotations] = parse_messages(defaults.messages);
const bundle = create_bundle(locale, defaults.messages);
const [out, format_errors] = format_messages(ast, bundle, defaults.variables);

const default_state = {
    locale,
    messages: defaults.messages,
    annotations,
    format_errors,
    variables: defaults.variables,
    variables_error: null,
    variables_string: JSON.stringify(defaults.variables, null, 4),
    ast,
    bundle,
    out
};

const KNOWN_PANELS = ["messages", "ast", "config", "console", "output"];

function set_window_location(state) {
    if (state.show_link) {
        history.replaceState(null, '', build_link_url(state));
    } else if (state.show_link === false) {
        const url = new URL(window.location);
        url.searchParams.delete('id');
        url.searchParams.delete('s');
        history.replaceState(null, '', url);
    }
}

export default function reducer(state = {
    ...default_state,
    dir: 'ltr',
    is_fetching: false,
    fixture_error: null,
    show_link: null,
    visible_panels: new Set(['messages', 'output'])
}, action) {
    set_window_location(state);
    switch (action.type) {
        case 'TOGGLE_PANEL': {
            const { name } = action;
            const visible_panels = new Set(state.visible_panels);

            return {
                ...state,
                visible_panels: visible_panels.delete(name)
                    ? visible_panels
                    : visible_panels.add(name)
            };
        }
        case 'CHANGE_MESSAGES': {
            const { value } = action;
            const { locale, variables } = state;
            const bundle = create_bundle(locale, value);
            const [ast, annotations] = parse_messages(value);
            const [out, format_errors] = format_messages(ast, bundle, variables);

            return {
                ...state,
                messages: value,
                annotations,
                format_errors,
                ast,
                bundle,
                out
            };
        }
        case 'CHANGE_LOCALE': {
            const { value: locale } = action;
            const { ast, messages, variables } = state;
            const bundle = create_bundle(locale, messages);
            const [out, format_errors] = format_messages(ast, bundle, variables);

            return {
                ...state,
                locale,
                format_errors,
                bundle,
                out
            };
        }
        case 'CHANGE_DIR': {
            return {
                ...state,
                dir: action.value
            };
        }
        case 'CHANGE_VARIABLES': {
            const { value } = action;
            const { ast, bundle } = state;

            const [variables, variables_error] = parse_variables(value);
            const [out, format_errors] = format_messages(ast, bundle, variables);

            return {
                ...state,
                variables,
                variables_error,
                variables_string: value,
                format_errors,
                out
            };
        }
        case 'REQUEST_GIST_FETCH': {
            return {
                ...state,
                is_fetching: true,
                fixture_error: null
            };
        }
        case 'ERROR_GIST_FETCH': {
            const { error } = action;
            return {
                ...state,
                is_fetching: false,
                fixture_error: error
            };
        }
        case 'RECEIVE_GIST_FETCH': {
            const { gist } = action;
            const bundle = create_bundle(locale, gist.messages);
            const [ast, annotations] = parse_messages(gist.messages);
            const [out, format_errors] = format_messages(ast, bundle, gist.variables);
            const gist_panels = Array.isArray(gist.setup.visible) ?
                new Set(gist.setup.visible.filter(
                    panel_name => KNOWN_PANELS.includes(panel_name))):
                state.visible_panels;

            return {
                ...state,
                show_link: true,
                is_fetching: false,
                visible_panels: gist_panels,
                locale: gist.setup.locale,
                dir: gist.setup.dir,
                messages: gist.messages,
                annotations,
                variables: gist.variables,
                variables_error: null,
                variables_string: JSON.stringify(gist.variables, null, 4),
                format_errors,
                ast,
                bundle,
                out
            };
        }
        case 'ERROR_OPEN_LINK': {
            const { error } = action;
            return { ...state, fixture_error: error };
        }
        case 'OPEN_LINK': {
            const { body } = action;
            const bundle = create_bundle(locale, body.messages);
            const [ast, annotations] = parse_messages(body.messages);
            const [out, format_errors] = format_messages(ast, bundle, body.variables);
            const visible_panels = Array.isArray(body.setup.visible) ?
                new Set(body.setup.visible.filter(
                    panel_name => KNOWN_PANELS.includes(panel_name))):
                state.visible_panels;

            return {
                ...state,
                show_link: true,
                visible_panels,
                locale: body.setup.locale,
                dir: body.setup.dir,
                messages: body.messages,
                annotations,
                variables: body.variables,
                variables_error: null,
                variables_string: JSON.stringify(body.variables, null, 4),
                format_errors,
                ast,
                bundle,
                out
            };
        }
        case 'TOGGLE_LINK': {
            const next = { ...state, show_link: !state.show_link };
            set_window_location(next);
            return next;
        }
        case 'RESET_ALL': {
            return {
                ...default_state,
                is_fetching: false,
                fixture_error: null,
                visible_panels: new Set(['messages', 'output'])
            };
        }
        default:
            return state;
    }
}
