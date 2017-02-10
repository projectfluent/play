import React from 'react';
import { connect } from 'react-redux';

function ErrorDisplay(props) {
    const { error: { name, message } } = props;
    return (
        <div>
            <strong className="error__name">{name}</strong>
            <em className="error__message">{message}</em>
        </div>
    );
}

function ErrorsPanel(props) {
    const { errors } = props;
    
    return (
        <section className="panel">
            <h1 className="panel__title">Errors</h1>
            {errors.map((err, idx) => (
                <ErrorDisplay key={idx} error={err} />
            ))}
        </section>
    );
}

function mapState(state) {
    const { externals_errors, translations_errors } = state;
    return {
        errors: [...externals_errors, ...translations_errors]
    };
}

export default connect(mapState)(ErrorsPanel);
