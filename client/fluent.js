import { FluentBundle, FluentResource } from '@fluent/bundle';
import { FluentParser, lineOffset, columnOffset, Resource }
    from '@fluent/syntax';

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
    bundle.addResource(new FluentResource(messages));
    return bundle;
}

export function format_messages(ast, bundle, variables) {
    const outputs = new Map(); 
    const errors = [];
    for (const entry of ast.body) {
        if (entry.type !== "Message") {
            continue;
        }

        let id = entry.id.name;
        let message = bundle.getMessage(id);
        let value = message.value
            ? bundle.formatPattern(message.value, variables, errors)
            : null;
        let attributes = [];
        for (let [name, value] of Object.entries(message.attributes)) {
            attributes.push({
                id: name,
                value: bundle.formatPattern(value, variables, errors)
            })
        }

        outputs.set(id, {id, value, attributes});
    }
    return [outputs, errors];
}

const iso_re = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export function parse_variables(variables) {
    try {
        var obj = JSON.parse(variables);
    } catch (err) {
        return [{}, err];
    }

    for (const [key, val] of Object.entries(obj)) {
      if (iso_re.test(val)) {
        obj[key] = new Date(val);
      }
    }

    return [obj, null];
}
