import React from 'react';
import { connect } from 'react-redux';

import Editor from './editor';
import { change_locale, change_dir, change_externals } from './actions';

function ConfigPanel(props) {
    const {
        locale, dir, externals, change_locale, change_dir, change_externals
    } = props;

    return (
        <section className="panel">
            <h1 className="panel__title">Language & Direction</h1>
            <div className="setting">
                <label className="setting__name" htmlFor="locale">
                    Language used for date, number and plural formatting.
                </label>
                <div className="setting__value">
                    <select id="locale" value={locale} onChange={change_locale}>
                        <option value="en-US">English</option>
                        <option value="pl">Polish</option>
                    </select>
                </div>
            </div>
            <div className="setting">
                <label className="setting__name" htmlFor="dir">
                    Direction of text in the output.
                </label>
                <div className="setting__value">
                    <select id="dir" value={dir} onChange={change_dir}>
                        <option value="ltr">Left-to-right</option>
                        <option value="rtl">Right-to-left</option>
                    </select>
                </div>
            </div>
            <h1 className="panel__title">External Data</h1>
            <Editor
                className="externals__editor"
                mode="json"
                gutter={false}
                value={externals}
                onChange={change_externals}
            />
            <p className="panel__hint">
                Hint: You can pass dates in the simplified extended
                ISO8601 format, as returned by <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString">Date.toISOString</a>,
                e.g. <code>"{ new Date().toISOString() }"</code>.
            </p>
        </section>
    );
}

const mapState = state => ({
    locale: state.locale,
    dir: state.dir,
    externals: state.externals_string
});

const mapDispatch = {
    change_locale: evt => change_locale(evt.target.value),
    change_dir: evt => change_dir(evt.target.value),
    change_externals
};

export default connect(mapState, mapDispatch)(ConfigPanel);
