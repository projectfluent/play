/* global Fluent */

export function create_context(translations) {
    const context = new Fluent.MessageContext('en-US');
    context.addMessages(translations);
    return context;
}

export function format_messages(context, externals) {
    const outputs = new Map(); 
    const errors = [];
    for (const [id, message] of context.messages) {
        outputs.set(id, context.format(message, externals, errors)); 
    }
    return [outputs, errors];
}

export function parse_externals(externals) {
    try {
        return [JSON.parse(externals), []];
    } catch (err) {
        return [{}, [err]];
    }
}

// defaults

const translations = 'hello-world = Hello, { $who }!';
const externals = { who: 'world' };
const externals_string = JSON.stringify(externals, null, 4);
const context = create_context(translations);
const [outputs, fmt_errors] = format_messages(context, externals);

export const default_state = {
    translations,
    translations_errors: [...fmt_errors],
    externals,
    externals_errors: [],
    externals_string,
    context,
    outputs
}
