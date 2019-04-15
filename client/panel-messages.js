import React from 'react';
import { connect } from 'react-redux';

import Editor from './editor';
import { change_messages } from './actions';

function MessagesPanel(props) {
    const { value, annotations, change_messages } = props;

    return (
        <section className="panel panel--white">
            <h1 className="panel__title">Messages</h1>
            <Editor
                mode="fluent"
                className="messages__editor"
                fontSize={16}
                showGutter={true}
                value={value}
                annotations={annotations}
                onChange={change_messages}
            />
        </section>
    );
}

const mapState = state => ({
    value: state.messages,
    annotations: state.annotations.map(annot => ({
        type: 'error',
        text: `${annot.code}: ${annot.message}`,
        row: annot.line_offset,
        column: annot.column_offset
    }))
});

const mapDispatch = {
    change_messages
};

export default connect(mapState, mapDispatch)(MessagesPanel);
