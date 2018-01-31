/* global ace */

ace.define(
    "ace/theme/fluent",
    ["require", "exports", "module", "ace/lib/dom"],
    theme
);

function theme(acequire, exports, module) {
    exports.isDark = false;
    exports.cssClass = "ace-fluent";


    exports.cssText = `
        .ace-fluent {
            background-color: #f7f7f7;
            color: #222;
        }

        .ace-fluent .ace_cursor {
            color: #222;
        }

        .ace-fluent .ace_gutter {
            background: #e8e8e8;
            color: #aaa;
        }

        .ace-fluent .ace_print-margin {
            width: 1px;
            background: #e8e8e8;
        }

        .ace-fluent .ace_invisible {
            color: #bfbfbf
        }

        .ace-fluent .ace_indent-guide {
            background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==") right repeat-y;
        }

        .ace-fluent .ace_comment {
            color: #999;
            font-style: italic;
        }

        .ace-fluent .ace_message {
            font-weight: bold;
        }

        .ace-fluent .ace_string {
            color: #1a1aa6;
        }

        .ace-fluent .ace_number {
            color: #08c;
        }

        .ace-fluent .ace_variantName {
            color: #222;
        }

        .ace-fluent .ace_variable {
            color: #930f80;
        }

        .ace-fluent .ace_function {
            color: #08c;
        }

        .ace-fluent .ace_invalid {
            background-color: rgba(255, 0, 0, 0.1);
            color: red;
        }

        .ace-fluent.ace_focus .ace_marker-layer .ace_active-line {
            background: rgb(255, 255, 204);
        }

        .ace-fluent .ace_marker-layer .ace_active-line {
            background: rgb(245, 245, 245);
        }

        .ace-fluent .ace_marker-layer .ace_selection {
            background: rgb(181, 213, 255);
        }

        .ace-fluent.ace_multiselect .ace_selection.ace_start {
            box-shadow: 0 0 3px 0px white;
        }

        .ace-fluent.ace_nobold .ace_line > span {
            font-weight: normal !important;
        }

        .ace-fluent .ace_marker-layer .ace_step {
            background: rgb(252, 255, 0);
        }

        .ace-fluent .ace_marker-layer .ace_stack {
            background: rgb(164, 229, 101);
        }

        .ace-fluent .ace_marker-layer .ace_bracket {
            margin: -1px 0 0 -1px;
            border: 1px solid rgb(192, 192, 192);
        }

        .ace-fluent .ace_gutter-active-line {
            background-color : rgba(0, 0, 0, 0.07);
        }

        .ace-fluent .ace_marker-layer .ace_selected-word {
            background: rgb(250, 250, 255);
            border: 1px solid rgb(200, 200, 250);
        }
    `;

    const dom = acequire("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
}
