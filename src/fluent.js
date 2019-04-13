import 'intl-pluralrules';
import { FluentBundle } from 'fluent/compat';
import { FluentParser, lineOffset, columnOffset, Resource }
    from 'fluent-syntax/compat';

const fluent_parser = new FluentParser();

function annotation_display(source, junk, annot) {
    const { code, message, span: { start } } = annot;

    const slice = source.substring(junk.span.start, junk.span.end);
    const line_offset = lineOffset(source, start);
    const column_offset = columnOffset(source, start);
    const span_offset = lineOffset(source, junk.span.start);
    const head_len = line_offset - span_offset + 1;
    const lines = slice.split('\n');
    const head = lines.slice(0, head_len).join('\n') + '\n';
    const tail = lines.slice(head_len).join('\n');

    return {
        code,
        message,
        line_offset,
        column_offset,
        head,
        tail
    }
}

export function parse_messages(messages) {
    try {
        var res = fluent_parser.parse(messages);
    }  catch (err) {
        console.error(err);
        return [
          new Resource([]),
          []
        ];
    }

    const junks = res.body.filter(entry => entry.type === "Junk");
    const annotations = junks.reduce(
        (annots, junk) => annots.concat(
            junk.annotations.map(
                annot => annotation_display(messages, junk, annot)
            )
        ),
        []
    );
    return [res, annotations];
}

export function create_bundle(locale, messages) {
    const bundle = new FluentBundle(locale);
    bundle.addMessages(messages);
    return bundle;
}

export function format_messages(ast, bundle, variables) {
    const outputs = new Map(); 
    const errors = [];
    for (const entry of ast.body) {
        if (entry.type !== "Message") {
            continue;
        }
        const id = entry.id.name;
        const message = bundle.getMessage(id);
        const formatted_message = {
            id,
            value: bundle.format(message, variables, errors),
            attributes: Object.entries(message && message.attrs || {}).map(
                ([attr_id, attr_value]) => ({
                    id: attr_id,
                    value: bundle.format(attr_value, variables, errors)
                })
            )
        };
        outputs.set(id, formatted_message);
    }
    return [outputs, errors];
}

const iso_re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export function parse_variables(variables) {
    try {
        var obj = JSON.parse(variables);
    } catch (err) {
        return [{}, [err]];
    }

    for (const [key, val] of Object.entries(obj)) {
      if (iso_re.test(val)) {
        obj[key] = new Date(val);
      }
    }

    return [obj, []];
}
