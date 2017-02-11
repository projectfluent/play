/* global Fluent */

export function parse_translations(translations) {
    return Fluent.syntax.parser.parse(translations);
}

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
