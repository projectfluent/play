import React from 'react';
import { connect } from 'react-redux';

import TranslationsPanel from './panel-translations';
import ExternalsPanel from './panel-externals';
import ErrorsPanel from './panel-errors';
import OutputPanel from './panel-output';

function Panels(props) {
    const { visible } = props;
    return (
        <div className="panels">
            { visible.has('translations') && <TranslationsPanel /> }
            { visible.has('external') && <ExternalsPanel /> }
            { visible.has('errors') && <ErrorsPanel /> }
            { visible.has('output') && <OutputPanel /> }
        </div>
    );
}

function mapState(state) {
    return {
        visible: state.visible_panels
    };
}

export default connect(mapState)(Panels);
