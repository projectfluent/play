/* global ace */

ace.define(
    "ace/mode/fluent_highlight_rules",
    ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"],
    highlighting
);

ace.define(
    "ace/mode/fluent",
    ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/fluent_highlight_rules"],
    mode
);

function highlighting(acequire, exports) {
    const oop = acequire("../lib/oop");
    const TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

    const FluentHighlightRules = function() {

        const _ = '\\s*';
        const number = '[0-9]+(?:\\.[0-9]+)?';
        const identifier = '[a-zA-Z-][a-zA-Z0-9_-]*';
        const word = '[^\\s{}\\[\\]\\\\]+';
        const variantName = `${word}(?:[ \t]+${word})?`;

        this.$rules = {
            "start" : [
                {
                    token: "comment",
                    regex: /^#{1,3}($| .*$)/
                },
                {
                    token: "message.identifier",
                    regex: `^-?${identifier}${_}=`,
                    push: "value"
                },
                {
                    token: "message.attribute",
                    regex: `^${_}\\.${identifier}${_}=`,
                    push: "value"
                },
                {
                    defaultToken: "invalid"
                }
            ],
            "value" : [
                {
                    regex : /(?:^\s+)?{/,
                    token : "placeable",
                    push : "placeable"
                },
                {
                    regex: /^\s+[^.#*[}\s]+/,
                    token: "string"
                },
                {
                    regex: /^\s*$/,
                    token: "string"
                },
                {
                    regex: /^/,
                    next: "pop"
                },
                {
                    defaultToken: "string"
                }
            ],
            "placeable" : [
                {
                    regex : /^\S.*$/,
                    token : "invalid",
                    next : "pop"
                },
                {
                    regex : `^(${_})(\\*?\\[${_})(${number})(${_}\\])`,
                    token : ["text", "operator", "number", "operator"],
                    push: "value"
                },
                {
                    regex : `^(${_})(\\*?\\[${_})(${variantName})(${_}\\])`,
                    token : ["text", "operator", "variantName", "operator"],
                    push: "value"
                },
                {
                    regex : /".*"/,
                    token : "string.quoted"
                },
                {
                    regex : /[A-Z][A-Z_?-]*/,
                    token : "function.name",
                },
                {
                    regex : /\(/,
                    token : "function.paren",
                },
                {
                    regex : /\s*,\s*/,
                    token : "function.comma",
                },
                {
                    regex : `${identifier}\\s*:\\s*`,
                    token : "function.argname",
                },
                {
                    regex : /\)/,
                    token : "function.paren"
                },
                {
                    regex : number,
                    token : "number"
                },
                {
                    regex : `\\$${identifier}`,
                    token : "variable"
                },
                {
                    regex : `(-${identifier})(\\[${variantName}\\])`,
                    token : ["message.identifier", "variantName"]
                },
                {
                    regex : `(${identifier})(\\.${identifier})`,
                    token : ["message.identifier", "message.attribute"]
                },
                {
                    regex : identifier,
                    token : "message.identifier"
                },
                {
                    regex : `-${identifier}`,
                    token : "message.identifier"
                },
                {
                    regex : /\s*->\s*$/,
                    token : "operator",
                },
                {
                    regex: /\s+/,
                    token: "string"
                },
                {
                    regex : /}/,
                    token : "placeable",
                    next : "pop"
                },
                {
                    defaultToken: "invalid"
                }
            ]
        };

        this.normalizeRules();

    };

    oop.inherits(FluentHighlightRules, TextHighlightRules);
    exports.FluentHighlightRules = FluentHighlightRules;
}

function mode(acequire, exports) {
    const oop = acequire("../lib/oop");
    const TextMode = acequire("./text").Mode;
    const FluentHighlightRules = acequire("./fluent_highlight_rules").FluentHighlightRules;

    const Mode = function() {
        this.HighlightRules = FluentHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        this.$id = "ace/mode/fluent";
    }).call(Mode.prototype);

    exports.Mode = Mode;
}
