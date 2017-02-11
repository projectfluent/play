import React, { Component } from 'react';

import brace from 'brace';
import 'brace/theme/github';
import 'brace/mode/json';
import './editor-mode-fluent.js';

class Editor extends Component {
    componentDidMount(){
        const {
            mode, gutter = "true", value, onChange
        } = this.props;
        const editor = brace.edit(this.root);

        editor.setValue(value);
        editor.clearSelection();
        editor.on('change', () => onChange(editor.getValue()));

        editor.setOptions({
            selectionStyle: 'text',
            highlightActiveLine: false,
            highlightSelectedWord: false,
            readOnly: false,
            cursorStyle: 'ace',
            mergeUndoDeltas: false,
            behavioursEnabled: false,
            wrapBehavioursEnabled: false,
            autoScrollEditorIntoView: false,

            // renderer options
            hScrollBarAlwaysVisible: false,
            vScrollBarAlwaysVisible: false,
            highlightGutterLine: true,
            animatedScroll: false,
            showInvisibles: false,
            showPrintMargin: false,
            printMarginColumn: false,
            printMargin: false,
            fadeFoldWidgets: false,
            showFoldWidgets: false,
            showLineNumbers: false,
            showGutter: gutter,
            displayIndentGuides: false,
            fontSize: 16,
            //fontFamily: 'monospace', 
            scrollPastEnd: false,
            fixedWidthGutter: false,
            theme: `ace/theme/github`
        });

        editor.getSession().setOptions({
            useWorker: false,
            useSoftTabs: true,
            tabSize: 4,
            mode: `ace/mode/${mode}`
        });

    }

    render() {
        const { className } = this.props;
        return (
            <div
                className={className}
                ref={elem => this.root = elem}
            ></div>
        );
    }
}

export default Editor;
