import { translations, externals } from './defaults';
import {
    parse_translations, create_context, format_messages, parse_externals,
} from './fluent';
import { validate_gist } from './github';

const locale = 'en-US';
const [ast, annotations] = parse_translations(translations);
const externals_string = JSON.stringify(externals, null, 4);
const ctx = create_context(locale, translations);
const [out, format_errors] = format_messages(ctx, externals);

const default_state = {
    locale,
    translations,
    annotations,
    format_errors,
    externals,
    externals_errors: [],
    externals_string,
    ast,
    ctx,
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
            const ctx = create_context(locale, value);
            const [ast, annotations] = parse_translations(value);
            const [out, format_errors] = format_messages(ctx, externals);

            return {
                ...state,
                translations: value,
                annotations,
                format_errors,
                ast,
                ctx,
                out
            };
        }
        case 'CHANGE_LOCALE': {
            const { value: locale } = action;
            const { translations, externals } = state;
            const ctx = create_context(locale, translations);
            const [out, format_errors] = format_messages(ctx, externals);

            return {
                ...state,
                locale,
                format_errors,
                ctx,
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
            const { ctx } = state;

            const [externals, externals_errors] = parse_externals(value);
            const [out, format_errors] = format_messages(ctx, externals);

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

            try {
                validate_gist(gist);
            } catch(error) {
                return {
                    ...state,
                    is_fetching: false,
                    fixture_error: error
                };
            }

            const { files } = gist;
            const translations = files['playground.ftl'].content;
            const externals_string = files['playground.json'].content;

            const { locale, dir } = parse_setup(files, state);

            const ctx = create_context(locale, translations);
            const [ast, annotations] = parse_translations(translations);
            const [externals, externals_errors] = parse_externals(
                externals_string
            );
            const [out, format_errors] = format_messages(ctx, externals);

            return {
                ...state,
                is_fetching: false,
                locale,
                dir,
                translations,
                annotations,
                externals,
                externals_errors,
                externals_string,
                format_errors,
                ast,
                ctx,
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

function parse_setup(files, state) {
    if (!files['setup.json']) {
        return state;
    }

    const content = files['setup.json'].content;

    try {
        var setup = JSON.parse(content);
    } catch (err) {
        return state;
    }

    return {
        locale: setup.locale || state.locale,
        dir: setup.dir || state.dir,
    };
}
