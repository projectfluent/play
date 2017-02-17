import React from 'react';
import { connect } from 'react-redux';

import TranslationsPanel from './panel-translations';
import ExternalsPanel from './panel-externals';
import ConsolePanel from './panel-console';
import OutputPanel from './panel-output';

function Panels(props) {
    const { visible } = props;
    return (
        <div className="panels">
            { visible.has('translations') && <TranslationsPanel /> }
            { visible.has('external') && <ExternalsPanel /> }
            { visible.has('console') && <ConsolePanel /> }
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
