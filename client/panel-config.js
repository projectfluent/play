import React from 'react';
import { connect } from 'react-redux';

import Editor from './editor';
import { change_locale, change_dir, change_variables } from './actions';

function ConfigPanel(props) {
    const {
        locale, dir, variables, change_locale, change_dir, change_variables
    } = props;

    return (
        <section className="panel">
            <h1 className="panel__title">Language Settings</h1>
            <div className="setting">
                <label className="setting__name" htmlFor="locale">
                    Language used for date, number and plural formatting.
                </label>
                <div className="setting__value">
                    <select id="locale" value={locale} onChange={change_locale}>
                        <option value="ar">Arabic</option>
                        <option value="br">Breton</option>
                        <option value="zh-CN">Chinese (Simplified)</option>
                        <option value="zh-TW">Chinese (Traditional)</option>
                        <option value="cs">Czech</option>
                        <option value="da">Danish</option>
                        <option value="nl">Dutch</option>
                        <option value="en-US">English (US)</option>
                        <option value="en-GB">English (British)</option>
                        <option value="et">Estonian</option>
                        <option value="fi">Finnish</option>
                        <option value="fr">French</option>
                        <option value="ka">Georgian</option>
                        <option value="de">German</option>
                        <option value="he">Hebrew</option>
                        <option value="hi-IN">Hindi</option>
                        <option value="is">Icelandic</option>
                        <option value="ja">Japanese</option>
                        <option value="kn">Kannada</option>
                        <option value="lv">Latvian</option>
                        <option value="lt">Lithuanian</option>
                        <option value="mai">Maithili</option>
                        <option value="ne-NP">Nepali</option>
                        <option value="nb-NO">Norwegian bokmål</option>
                        <option value="pl">Polish</option>
                        <option value="gd">Scottish Gaelic</option>
                        <option value="si">Sinhala</option>
                        <option value="sk">Slovak</option>
                        <option value="sl">Slovenian</option>
                        <option value="sv">Swedish</option>
                        <option value="te">Telugu</option>
                        <option value="ur">Urdu</option>
                        <option value="cy">Welsh</option>
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
            <h1 className="panel__title">Variables</h1>
            <Editor
                className="variables__editor"
                mode="json"
                showGutter={false}
                value={variables}
                onChange={change_variables}
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
    variables: state.variables_string
});

const mapDispatch = {
    change_locale: evt => change_locale(evt.target.value),
    change_dir: evt => change_dir(evt.target.value),
    change_variables
};

export default connect(mapState, mapDispatch)(ConfigPanel);
