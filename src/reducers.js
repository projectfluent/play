import { translations, externals } from './defaults';
import {
    parse_translations, create_context, format_messages, parse_externals,
} from './fluent';

const [ast, annotations] = parse_translations(translations);
const externals_string = JSON.stringify(externals, null, 4);
const ctx = create_context(translations);
const [out, format_errors] = format_messages(ctx, externals);

const default_state = {
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
    is_fetching: false,
    fetch_error: null,
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
            const { externals } = state;
            const ctx = create_context(value);
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
        case 'REQUEST_GIST': {
            return {
                ...state,
                is_fetching: true,
            };
        }
        case 'ERROR_GIST': {
            return {
                ...state,
                is_fetching: false,
                fetch_error: 'Error fetching the gist',
            };
        }
        case 'RECEIVE_GIST': {
            const { files } = action.gist;
            if (!has_required_files(files)) {
                return {
                    ...state,
                    is_fetching: false,
                    fetch_error: 'The gist does not contain Playground data.',
                };
            }

            const translations = files['playground.ftl'].content;
            const externals_string = files['playground.json'].content;

            const ctx = create_context(translations);
            const [ast, annotations] = parse_translations(translations);
            const [externals, externals_errors] = parse_externals(
                externals_string
            );
            const [out, format_errors] = format_messages(ctx, externals);

            return {
                ...state,
                is_fetching: false,
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
        case 'RESET_ALL': {
            return {
                ...default_state,
                is_fetching: false,
                fetch_error: null,
                visible_panels: new Set(['translations', 'output'])
            };
        }
        default:
            return state;
    }
}

function has_required_files(files) {
    return ('playground.ftl' in files) && ('playground.json' in files);
}
