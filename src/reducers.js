import {
    parse_translations, create_context, format_messages, parse_externals,
} from './fluent';

// defaults

const translations = 'hello-world = Hello, { $who }!';
const [ast, parse_errors] = parse_translations(translations);
const externals = { who: 'world' };
const externals_string = JSON.stringify(externals, null, 4);
const ctx = create_context(translations);
const [out, format_errors] = format_messages(ctx, externals);

const default_state = {
    translations,
    parse_errors,
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
            const [ast, parse_errors] = parse_translations(value);
            const [out, format_errors] = format_messages(ctx, externals);

            return {
                ...state,
                translations: value,
                parse_errors,
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
        default:
            return state;
    }
}
