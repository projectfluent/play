import React from 'react';
import { connect } from 'react-redux';

import { toggle_panel } from './actions';

function PanelsList(props) {
    const { visible_panels, toggle_panel } = props;
    return (
        <div className="panelslist">
            <button
                className={
                    visible_panels.has('translations')
                        ? 'panelslist__button panelslist__button--active'
                        : 'panelslist__button'
                }
                onClick={evt => toggle_panel('translations', evt)}>
                Translations
            </button>

            <button
                className={
                    visible_panels.has('external')
                        ? 'panelslist__button panelslist__button--active'
                        : 'panelslist__button'
                }
                onClick={evt => toggle_panel('external', evt)}>
                External Data
            </button>

            <button
                className={
                    visible_panels.has('console')
                        ? 'panelslist__button panelslist__button--active'
                        : 'panelslist__button'
                }
                onClick={evt => toggle_panel('console', evt)}>
                Console
            </button>

            <button
                className={
                    visible_panels.has('output')
                        ? 'panelslist__button panelslist__button--active'
                        : 'panelslist__button'
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


export default connect(mapState, mapDispatch)(PanelsList);
