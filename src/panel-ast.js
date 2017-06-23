import React from 'react';
import { connect } from 'react-redux';

import Editor from './editor';

function ASTPanel(props) {
    const { ast } = props;

    return (
        <section className="panel">
            <h1 className="panel__title">Abstract Syntax Tree</h1>
            <Editor
                className="ast__editor"
                mode="json"
                readOnly={false}
                gutter={false}
                value={ast}
            />
        </section>
    );
}

const mapState = state => ({
    ast: JSON.stringify(state.ast, null, 4)
});

export default connect(mapState)(ASTPanel);
