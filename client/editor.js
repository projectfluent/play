import React from 'react';
import AceEditor from 'react-ace';

import brace from 'brace';
import 'brace/mode/json';

import './editor-mode-fluent';
import './editor-theme-fluent'

// https://github.com/ajaxorg/ace/wiki/Configuring-Ace
const ACE_OPTIONS = {
    // Editor options.
    selectionStyle: 'text',
    highlightActiveLine: false,
    highlightSelectedWord: false,
    cursorStyle: 'ace',
    mergeUndoDeltas: false,
    behavioursEnabled: false,
    wrapBehavioursEnabled: false,
    autoScrollEditorIntoView: false,

    // Renderer options.
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
    displayIndentGuides: false,
    scrollPastEnd: false,
    fixedWidthGutter: false,
};

export default
function Editor(props) {
    return <AceEditor
        mode="fluent"
        theme="fluent"
        fontSize={14}
        width="auto"
        setOptions={ACE_OPTIONS}
        debounceChangePeriod={200}
        onLoad={editor => editor.gotoLine(0)}
        {...props}
    />;
}
