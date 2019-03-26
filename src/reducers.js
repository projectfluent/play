import { translations, externals } from './defaults';
import {
    parse_translations, create_bundle, format_messages, parse_externals,
} from './fluent';

const locale = 'en-US';
const [ast, annotations] = parse_translations(translations);
const externals_string = JSON.stringify(externals, null, 4);
const bundle = create_bundle(locale, translations);
const [out, format_errors] = format_messages(ast, bundle, externals);

const default_state = {
    locale,
    translations,
    annotations,
    format_errors,
    externals,
    externals_errors: [],
    externals_string,
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
    visible_panels: new Set(['translations', 'output'])
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
        case 'CHANGE_TRANSLATIONS': {
            const { value } = action;
            const { locale, externals } = state;
            const bundle = create_bundle(locale, value);
            const [ast, annotations] = parse_translations(value);
            const [out, format_errors] = format_messages(ast, bundle, externals);

            return {
                ...state,
                translations: value,
                annotations,
                format_errors,
                ast,
                bundle,
                out
            };
        }
        case 'CHANGE_LOCALE': {
            const { value: locale } = action;
            const { ast, translations, externals } = state;
            const bundle = create_bundle(locale, translations);
            const [out, format_errors] = format_messages(ast, bundle, externals);

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
        case 'CHANGE_EXTERNALS': {
            const { value } = action;
            const { ast, bundle } = state;

            const [externals, externals_errors] = parse_externals(value);
            const [out, format_errors] = format_messages(ast, bundle, externals);

            return {
                ...state,
                externals,
                externals_errors,
                externals_string: value,
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
            const translations = gist.messages;
            const externals = gist.variables;
            const { locale, dir } = gist.setup;

            const bundle = create_bundle(locale, translations);
            const [ast, annotations] = parse_translations(translations);
            const [out, format_errors] = format_messages(ast, bundle, externals);

            return {
                ...state,
                is_fetching: false,
                locale,
                dir,
                translations,
                annotations,
                externals,
                externals_errors: [],
                externals_string: JSON.stringify(externals, null, 4),
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
            const { response: { id } } = action;

            return {
                ...state,
                is_creating: false,
                gist_id: id
            };
        }
        case 'RESET_ALL': {
            return {
                ...default_state,
                is_fetching: false,
                is_creating: false,
                fixture_error: null,
                visible_panels: new Set(['translations', 'output'])
            };
        }
        default:
            return state;
    }
}
