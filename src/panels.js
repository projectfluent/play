import React from 'react';
import { connect } from 'react-redux';

import TranslationsPanel from './panel-translations';
import ASTPanel from './panel-ast';
import ConfigPanel from './panel-config';
import ConsolePanel from './panel-console';
import OutputPanel from './panel-output';

function Panels(props) {
    const { visible } = props;
    return (
        <div className="panels">
            { visible.has('translations') && <TranslationsPanel /> }
            { visible.has('ast') && <ASTPanel /> }
            { visible.has('config') && <ConfigPanel /> }
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
