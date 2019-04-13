import React from 'react';
import { connect } from 'react-redux';

function indent(spaces) {
  return new Array(spaces + 1).join(' ');
}

function ErrorDisplay(props) {
    const { error: { name, message } } = props;

    return (
        <div className="error">
            <div className="error__name">{name}</div>
            <div className="error__message">{message}</div>
        </div>
    );
}

function AnnotationDisplay(props) {
    const {
        annotation: { code, message, line_offset, column_offset, head, tail }
    } = props;

    return (
        <div className="annotation">
            <div className="annotation__name">Parsing error {code} on line {line_offset + 1}</div>
            <pre className="annotation__slice">{head}</pre>
            <pre className="annotation__label">
                {indent(column_offset)}⮤ {message}
            </pre>
            <pre className="annotation__slice">{tail}</pre>
        </div>
    );
}

function ConsolePanel(props) {
    const { annotations, errors } = props;
    
    return (
        <section className="panel">
            <h1 className="panel__title">Console</h1>
            {annotations.map((annot, idx) => (
                <AnnotationDisplay key={idx} annotation={annot} />
            ))}
            {errors.map((err, idx) => (
                <ErrorDisplay key={idx} error={err} />
            ))}
        </section>
    );
}

function mapState(state) {
    const {
        variables_error,
        annotations,
        format_errors,
    } = state;
    const errors = variables_error
        ? [variables_error, ...format_errors]
        : format_errors;
    return {
        annotations,
        errors
    };
}

export default connect(mapState)(ConsolePanel);
