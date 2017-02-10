/* global ace */

ace.define("ace/mode/fluent_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(acequire, exports, module) {
var oop = acequire("../lib/oop");
var TextHighlightRules = acequire("./text_highlight_rules").TextHighlightRules;

var FluentHighlightRules = function() {

    this.$rules = {
        "start" : [
            {
                token : "comment",
                regex : /#.*$/
            },
            {
                token : "keyword",
                regex : /\*?\[.*\]/,
                push  : "value"
            },
            {
                token : "entity.name.tag",
                regex : /(.*=)\s*$/,
            },
            {
                regex : /^\s*\|/,
                token : "string",
                push  : "value"
            },
            {
                token : "entity.name.tag",
                regex : /(.*=)/,
                push  : "value"
            },
            {
                defaultToken: "string"
            }
        ],
        "placeable" : [
            {
                token : "entity.other",
                regex : /^\s*\*?\[.*\]/,
                push  : "value"
            },
            {
                regex : /{/,
                token : "variable.parameter",
                push : "placeable"
            },
            {
                regex : /}/,
                token : "variable.parameter",
                next : "pop"
            },
            {
                defaultToken: "variable.parameter"
            }
        ],
        "value" : [
            {
                regex : /^\s*\|/,
                token : "string",
            },
            {
                regex : /{/,
                token : "variable.parameter",
                push : "placeable"
            },
            {
                regex : /^/,
                token : "string",
                next : "pop"
            },
            {
                defaultToken: "string"
            }
        ],
    };

    this.normalizeRules();

};

oop.inherits(FluentHighlightRules, TextHighlightRules);

exports.FluentHighlightRules = FluentHighlightRules;
});

ace.define("ace/mode/fluent",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/fluent_highlight_rules"], function(acequire, exports, module) {

var oop = acequire("../lib/oop");
var TextMode = acequire("./text").Mode;
var FluentHighlightRules = acequire("./fluent_highlight_rules").FluentHighlightRules;

var Mode = function() {
    this.HighlightRules = FluentHighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    this.$id = "ace/mode/fluent";
}).call(Mode.prototype);

exports.Mode = Mode;
});
