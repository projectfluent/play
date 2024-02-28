import React from 'react';
import { connect } from 'react-redux';

import { toggle_link } from './actions';
import { build_link_url } from './link';

function Share(props) {
    const {
        is_fetching, fixture_error, show_link, toggle_link, variables_error
    } = props;

    let disabled = false;
    let more = null;
    let text = 'Show shareable link';
    if (is_fetching || fixture_error || variables_error) {
        disabled = true;
    } else if (show_link) {
        more = <input
            readOnly
            type="text"
            value={build_link_url(props)}
            onFocus={ev => ev.target.select()}
        />;
        text = 'Hide shareable link';
    }

    return (
        <div>
            <button
                className="share__button"
                disabled={disabled}
                onClick={toggle_link}
            >
                { text }
            </button>
            { more }
        </div>
    );
}

const mapState = state => state;

const mapDispatch = {
    toggle_link,
};

export default connect(mapState, mapDispatch)(Share);
