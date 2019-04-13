import * as defaults from './defaults';
import {
    parse_messages, create_bundle, format_messages, parse_variables,
} from './fluent';

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
    variables_errors: [],
    variables_string: JSON.stringify(defaults.variables, null, 4),
    ast,
    bundle,
    out
};

export default function reducer(state = {
    ...default_state,
    dir: 'ltr',
    is_fetching: false,
    fixture_error: null,
    is_creating: false,
    create_error: null,
    gist_id: null,
    visible_panels: new Set(['messages', 'output'])
}, action) {
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

            const [variables, variables_errors] = parse_variables(value);
            const [out, format_errors] = format_messages(ast, bundle, variables);

            return {
                ...state,
                variables,
                variables_errors,
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

            return {
                ...state,
                is_fetching: false,
                locale: gist.setup.locale,
                dir: gist.setup.dir,
                messages: gist.messages,
                annotations,
                variables: gist.variables,
                variables_errors: [],
                variables_string: JSON.stringify(gist.variables, null, 4),
                format_errors,
                ast,
                bundle,
                out
            };
        }
        case 'REQUEST_GIST_CREATE': {
            return {
                ...state,
                is_creating: true,
                create_error: null,
                gist_id: null
            };
        }
        case 'ERROR_GIST_CREATE': {
            const { error } = action;
            return {
                ...state,
                is_creating: false,
                create_error: error,
                gist_id: null
            };
        }
        case 'RECEIVE_GIST_CREATE': {
            const { response } = action;
            return {
                ...state,
                is_creating: false,
                gist_id: response.id
            };
        }
        case 'RESET_ALL': {
            return {
                ...default_state,
                is_fetching: false,
                is_creating: false,
                fixture_error: null,
                visible_panels: new Set(['messages', 'output'])
            };
        }
        default:
            return state;
    }
}
