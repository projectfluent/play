import React from 'react';
import { connect } from 'react-redux';

import Editor from './editor';
import { change_externals } from './actions';

function ExternalsPanel(props) {
    const { value, change_externals } = props;
    return (
        <section className="panel">
            <h1 className="panel__title">External Data</h1>
            <Editor
                className="externals__editor"
                mode="json"
                gutter={false}
                value={value}
                onChange={change_externals}
            />
        </section>
    );
}

const mapState = state => ({
    value: state.externals_string
});

const mapDispatch = {
    change_externals
};

export default connect(mapState, mapDispatch)(ExternalsPanel);
