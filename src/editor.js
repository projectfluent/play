import React, { Component } from 'react';

import brace from 'brace';
import 'brace/mode/json';

import './editor-mode-fluent';
import './editor-theme-fluent'


class Editor extends Component {
    componentWillReceiveProps(nextProps) {
        // XXX We don't allow changing most of the Editor config here to avoid
        // infinite loops between setValue and onChange.

        const { annotations, value } = nextProps;

        if (annotations) {
            this.editor.getSession().setAnnotations(annotations);
        }

        if (value && !this.props.onChange) {
            this.editor.setValue(value);
            this.editor.clearSelection();
        }
    }

    componentDidMount(){
        const {
            annotations = [], fontSize = 14, gutter = true, mode = "fluent",
            onChange, readOnly = false, value = ""
        } = this.props;

        this.editor = brace.edit(this.root);

        this.editor.setValue(value);
        this.editor.getSession().setAnnotations(annotations);
        this.editor.clearSelection();
        this.editor.gotoLine(0);

        if (onChange) {
            this.editor.on('change', () => onChange(this.editor.getValue()));
        }

        this.editor.setOptions({
            selectionStyle: 'text',
            highlightActiveLine: false,
            highlightSelectedWord: false,
            readOnly,
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
            fontSize,
            scrollPastEnd: false,
            fixedWidthGutter: false,
            theme: `ace/theme/fluent`
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
