import {
    create_context, format_messages, parse_externals, default_state
} from './state';

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
            const context = create_context(value);
            const [outputs, fmt_errors] = format_messages(context, externals)

            return {
                ...state,
                translations: value,
                translations_errors: [...fmt_errors],
                context,
                outputs
            };
        }
        case 'CHANGE_EXTERNALS': {
            const { value } = action;
            const { context } = state;

            const [externals, externals_errors] = parse_externals(value);
            const [outputs, fmt_errors] = format_messages(context, externals)

            return {
                ...state,
                externals,
                externals_errors,
                externals_string: value,
                translations_errors: [...fmt_errors],
                outputs
            };
        }
        default:
            return state;
    }
}
