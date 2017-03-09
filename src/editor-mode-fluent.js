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

function highlighting(acequire, exports, module) {
    const oop = acequire("../lib/oop");
    const TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

    const FluentHighlightRules = function() {

        const _ = '\\s*';
        const number = '[0-9]+(?:\\.[0-9]+)?';
        const identifier = '[a-zA-Z_?-][a-zA-Z0-9_?-]*';
        const word = '[^\\s{}\\[\\]\\\\]+';
        const symbol = `${word}(?:[ \t]+${word})?`;

        this.$rules = {
            "start" : [
                {
                    token: "comment",
                    regex: /^\/\/ .*$/
                },
                {
                    token: "section",
                    regex: /^\[\[/,
                    push: "section"
                },
                {
                    token: "message.identifier",
                    regex: `^${identifier}${_}=`,
                    push: "value"
                },
                {
                    token : "message.identifier",
                    regex: `^${identifier}${_}`,
                },
                {
                    token: "message.attribute",
                    regex: `^${_}\\.${identifier}${_}=`,
                    push: "value"
                },
                {
                    token: "message.tag",
                    regex: `^${_}#${word}$`,
                },
                {
                    defaultToken: "invalid"
                }
            ],
            "section" : [
                {
                    token : "section",
                    regex : /\]\]\s*$/,
                    next: "pop"
                },
                {
                    defaultToken: "section"
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
                    regex : `^(${_})(\\*?\\[${_})(${symbol})(${_}\\])`,
                    token : ["text", "operator", "symbol", "operator"],
                    push: "value"
                },
                {
                    regex : /".*"/,
                    token : "string.quoted"
                },
                {
                    regex : /[A-Z_?-]+/,
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
                    regex : `(${identifier})(\\[${symbol}\\])`,
                    token : ["message.identifier", "symbol"]
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
                    regex : /\s*->\s*$/,
                    token : "operator",
                },
                {
                    regex : /}/,
                    token : "placeable",
                    next : "pop"
                },
            ]
        };

        this.normalizeRules();

    };

    oop.inherits(FluentHighlightRules, TextHighlightRules);
    exports.FluentHighlightRules = FluentHighlightRules;
}

function mode(acequire, exports, module) {
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
