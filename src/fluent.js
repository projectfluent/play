/* global Fluent, FluentSyntax */

function annotation_display(source, entry, annot) {
    const { name, message, pos } = annot;

    const slice = source.substring(entry.span.from, entry.span.to).trimRight();
    const line_offset = FluentSyntax.lineOffset(source, pos);
    const column_offset = FluentSyntax.columnOffset(source, pos);
    const span_offset = FluentSyntax.lineOffset(source, entry.span.from);
    const head_len = line_offset - span_offset + 1;
    const lines = slice.split('\n');
    const head = lines.slice(0, head_len).join('\n');
    const tail = lines.slice(head_len).join('\n');

    return {
        name,
        message,
        line_offset,
        column_offset,
        head,
        tail
    }
}

export function parse_translations(translations) {
    const res = FluentSyntax.parse(translations);
    const annotations = res.body.reduce(
        (annots, entry) => annots.concat(
            entry.annotations.map(
                annot => annotation_display(translations, entry, annot)

            )
        ),
        []
    );
    return [res, annotations];
}

export function create_context(locale, translations) {
    const context = new Fluent.MessageContext(locale);
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
