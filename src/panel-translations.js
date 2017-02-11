import React from 'react';
import { connect } from 'react-redux';

import Editor from './editor';
import { change_translations } from './actions';

function TranslationsPanel(props) {
    const { value, annotations, change_translations } = props;

    return (
        <section className="panel panel--white">
            <h1 className="panel__title">Translations</h1>
            <Editor
                mode="fluent"
                className="translations__editor"
                gutter={true}
                value={value}
                annotations={annotations}
                onChange={change_translations}
            />
        </section>
    );
}

const mapState = state => ({
    value: state.translations,
    annotations: state.parse_errors.map(err => ({
        type: 'error',
        text: err.message,
        row: err.lineNumber - 1,
        column: err.columnNumber
    }))
});

const mapDispatch = {
    change_translations
};

export default connect(mapState, mapDispatch)(TranslationsPanel);
