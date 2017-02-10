import React from 'react';
import { connect } from 'react-redux';

import { toggle_panel } from './actions';

function PanelList(props) {
    const { visible_panels, toggle_panel } = props;
    return (
        <div className="panellist">
            <button
                className={
                    visible_panels.has('translations')
                        ? 'panellist__button panellist__button--active'
                        : 'panellist__button'
                }
                onClick={evt => toggle_panel('translations', evt)}>
                Translations
            </button>

            <button
                className={
                    visible_panels.has('external')
                        ? 'panellist__button panellist__button--active'
                        : 'panellist__button'
                }
                onClick={evt => toggle_panel('external', evt)}>
                External Data
            </button>

            <button
                className={
                    visible_panels.has('errors')
                        ? 'panellist__button panellist__button--active'
                        : 'panellist__button'
                }
                onClick={evt => toggle_panel('errors', evt)}>
                Errors
            </button>

            <button
                className={
                    visible_panels.has('output')
                        ? 'panellist__button panellist__button--active'
                        : 'panellist__button'
                }
                onClick={evt => toggle_panel('output', evt)}>
                Output
            </button>
        </div>
    );
}

function mapState(state) {
    return {
        visible_panels: state.visible_panels
    };
}

function mapDispatch(dispatch) {
    return {
        toggle_panel(name, evt) {
            dispatch(toggle_panel(name));
            evt.currentTarget.blur();
        }
    };
}


export default connect(mapState, mapDispatch)(PanelList);
