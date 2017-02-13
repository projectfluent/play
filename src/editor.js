import React, { Component } from 'react';

import brace from 'brace';
import 'brace/theme/github';
import 'brace/mode/json';
import './editor-mode-fluent.js';

class Editor extends Component {
    componentWillReceiveProps(nextProps) {
        const { annotations } = nextProps;
        this.editor.getSession().setAnnotations(annotations);
    }

    componentDidMount(){
        const {
            mode, gutter = "true", value, annotations, onChange
        } = this.props;

        this.editor = brace.edit(this.root);

        this.editor.setValue(value);
        this.editor.getSession().setAnnotations(annotations);
        this.editor.clearSelection();
        this.editor.on('change', () => onChange(this.editor.getValue()));

        this.editor.setOptions({
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

        this.editor.getSession().setOptions({
            firstLineNumber: 1,
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
