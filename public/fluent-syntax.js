(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.FluentSyntax = global.FluentSyntax || {})));
}(this, (function (exports) { 'use strict';

class Node {
  constructor() {}
}

class Resource extends Node {
  constructor(body = [], comment = null, source = '') {
    super();
    this.type = 'Resource';
    this.body = body;
    this.comment = comment;
    this.source = source;
  }
}

class Entry extends Node {
  constructor() {
    super();
    this.type = 'Entry';
    this.annotations = [];
  }

  addSpan(from, to) {
    this.span = { from, to };
  }

  addAnnotation(annot) {
    this.annotations.push(annot);
  }
}

class Message extends Entry {
  constructor(id, value = null, attributes = null, comment = null) {
    super();
    this.type = 'Message';
    this.id = id;
    this.value = value;
    this.attributes = attributes;
    this.comment = comment;
  }
}

class Pattern extends Node {
  constructor(elements, quoted = false) {
    super();
    this.type = 'Pattern';
    this.elements = elements;
    this.quoted = quoted;
  }
}

class Expression extends Node {
  constructor() {
    super();
    this.type = 'Expression';
  }
}

class StringExpression extends Expression {
  constructor(value) {
    super();
    this.type = 'StringExpression';
    this.value = value;
  }
}

class NumberExpression extends Expression {
  constructor(value) {
    super();
    this.type = 'NumberExpression';
    this.value = value;
  }
}

class MessageReference extends Expression {
  constructor(id) {
    super();
    this.type = 'MessageReference';
    this.id = id;
  }
}

class ExternalArgument extends Expression {
  constructor(id) {
    super();
    this.type = 'ExternalArgument';
    this.id = id;
  }
}

class SelectExpression extends Expression {
  constructor(expression, variants) {
    super();
    this.type = 'SelectExpression';
    this.expression = expression;
    this.variants = variants;
  }
}

class AttributeExpression extends Expression {
  constructor(id, name) {
    super();
    this.type = 'AttributeExpression';
    this.id = id;
    this.name = name;
  }
}

class VariantExpression extends Expression {
  constructor(id, key) {
    super();
    this.type = 'VariantExpression';
    this.id = id;
    this.key = key;
  }
}

class CallExpression extends Expression {
  constructor(callee, args) {
    super();
    this.type = 'CallExpression';
    this.callee = callee;
    this.args = args;
  }
}

class Attribute extends Node {
  constructor(id, value) {
    super();
    this.type = 'Attribute';
    this.id = id;
    this.value = value;
  }
}

class Variant extends Node {
  constructor(key, value, def = false) {
    super();
    this.type = 'Variant';
    this.key = key;
    this.value = value;
    this.default = def;
  }
}

class NamedArgument extends Node {
  constructor(name, val) {
    super();
    this.name = name;
    this.val = val;
  }
}

class Identifier extends Node {
  constructor(name) {
    super();
    this.type = 'Identifier';
    this.name = name;
  }
}

class Keyword extends Identifier {
  constructor(name) {
    super(name);
    this.type = 'Keyword';
  }
}

class Comment extends Entry {
  constructor(content) {
    super();
    this.type = 'Comment';
    this.content = content;
  }
}

class Section extends Entry {
  constructor(key, comment = null) {
    super();
    this.type = 'Section';
    this.key = key;
    this.comment = comment;
  }
}

class Function extends Identifier {
  constructor(name) {
    super(name);
    this.type = 'Function';
  }
}

class Junk extends Entry {
  constructor(content) {
    super();
    this.type = 'Junk';
    this.content = content;
  }
}

class ParserStream {
  constructor(string) {
    this.string = string;
    this.iter = string[Symbol.iterator]();
    this.buf = [];
    this.peekIndex = 0;
    this.index = 0;

    this.iterEnd = false;
    this.peekEnd = false;

    this.ch = this.iter.next().value;
  }

  next() {
    if (this.iterEnd) {
      return undefined;
    }

    if (this.buf.length === 0) {
      this.ch = this.iter.next().value;
    } else {
      this.ch = this.buf.shift();
    }

    this.index++;

    if (this.ch === undefined) {
      this.iterEnd = true;
      this.peekEnd = true;
    }

    this.peekIndex = this.index;

    return this.ch;
  }

  current() {
    return this.ch;
  }

  currentIs(ch) {
    return this.ch === ch;
  }

  currentPeek() {
    if (this.peekEnd) {
      return undefined;
    }

    const diff = this.peekIndex - this.index;

    if (diff === 0) {
      return this.ch;
    }
    return this.buf[diff - 1];
  }

  currentPeekIs(ch) {
    return this.currentPeek() === ch;
  }

  peek() {
    if (this.peekEnd) {
      return undefined;
    }

    this.peekIndex += 1;

    const diff = this.peekIndex - this.index;

    if (diff > this.buf.length) {
      const ch = this.iter.next().value;
      if (ch !== undefined) {
        this.buf.push(ch);
      } else {
        this.peekEnd = true;
        return undefined;
      }
    }

    return this.buf[diff - 1];
  }

  getIndex() {
    return this.index;
  }

  getPeekIndex() {
    return this.peekIndex;
  }

  peekCharIs(ch) {
    if (this.peekEnd) {
      return false;
    }

    const ret = this.peek();

    this.peekIndex -= 1;

    return ret === ch;
  }

  resetPeek() {
    this.peekIndex = this.index;
    this.peekEnd = this.iterEnd;
  }

  skipToPeek() {
    const diff = this.peekIndex - this.index;

    for (let i = 0; i < diff; i++) {
      this.ch = this.buf.shift();
    }

    this.index = this.peekIndex;
  }
}

class Annotation {
  constructor(message) {
    this.message = message;
  }
}

class ParseError extends Annotation {
  constructor(message) {
    super(message);
    this.name = 'ParseError';
  }
}

function error(ps, message) {
  const err = new ParseError(message);
  err.pos = ps.getIndex();
  return err;
}

/* eslint no-magic-numbers: "off" */

class FTLParserStream extends ParserStream {
  peekLineWS() {
    let ch = this.currentPeek();
    while (ch) {
      if (ch !== ' ' && ch !== '\t') {
        break;
      }
      ch = this.peek();
    }
  }

  skipWSLines() {
    while (true) {
      this.peekLineWS();

      if (this.currentPeek() === '\n') {
        this.skipToPeek();
        this.next();
      } else {
        this.resetPeek();
        break;
      }
    }
  }

  skipLineWS() {
    while (this.ch) {
      if (this.ch !== ' ' && this.ch !== '\t') {
        break;
      }
      this.next();
    }
  }

  expectChar(ch) {
    if (this.ch === ch) {
      this.next();
      return true;
    }

    throw error(this, `Expected token ${ch}`);
  }

  takeCharIf(ch) {
    if (this.ch === ch) {
      this.next();
      return true;
    }
    return false;
  }

  takeChar(f) {
    const ch = this.ch;
    if (f(ch)) {
      this.next();
      return ch;
    }
    return undefined;
  }

  isIDStart() {
    const cc = this.ch.charCodeAt(0);
    return ((cc >= 97 && cc <= 122) || // a-z
            (cc >= 65 && cc <= 90) ||  // A-Z
             cc === 95);               // _
  }

  isNumberStart() {
    const cc = this.ch.charCodeAt(0);
    return ((cc >= 48 && cc <= 57) || cc === 45); // 0-9
  }

  isPeekNextLineVariantStart() {
    if (!this.currentPeekIs('\n')) {
      return false;
    }

    this.peek();

    this.peekLineWS();

    if (this.currentPeekIs('*')) {
      this.peek();
    }

    if (this.currentPeekIs('[') && !this.peekCharIs('[')) {
      this.resetPeek();
      return true;
    }
    this.resetPeek();
    return false;
  }

  isPeekNextLineAttributeStart() {
    if (!this.currentPeekIs('\n')) {
      return false;
    }

    this.peek();

    this.peekLineWS();

    if (this.currentPeekIs('.')) {
      this.resetPeek();
      return true;
    }

    this.resetPeek();
    return false;
  }

  skipToNextEntryStart() {
    while (this.next()) {
      if (this.currentIs('\n') && !this.peekCharIs('\n')) {
        this.next();
        if (this.ch === undefined || this.isIDStart() ||
            this.currentIs('#') ||
            (this.currentIs('[') && this.peekCharIs('['))) {
          break;
        }
      }
    }
  }

  takeIDStart() {
    if (this.isIDStart()) {
      const ret = this.ch;
      this.next();
      return ret;
    }
    throw error(this, 'Expected char range');
  }

  takeIDChar() {
    const closure = ch => {
      const cc = ch.charCodeAt(0);
      return ((cc >= 97 && cc <= 122) || // a-z
              (cc >= 65 && cc <= 90) || // A-Z
              (cc >= 48 && cc <= 57) || // 0-9
               cc === 95 || cc === 45);  // _-
    };

    return this.takeChar(closure);
  }

  takeKWChar() {
    const closure = ch => {
      const cc = ch.charCodeAt(0);
      return ((cc >= 97 && cc <= 122) || // a-z
              (cc >= 65 && cc <= 90) || // A-Z
              (cc >= 48 && cc <= 57) || // 0-9
               cc === 95 || cc === 45 || cc === 32);  // _-
    };

    return this.takeChar(closure);
  }

  takeDigit() {
    const closure = ch => {
      const cc = ch.charCodeAt(0);
      return (cc >= 48 && cc <= 57); // 0-9
    };

    return this.takeChar(closure);
  }
}

/*  eslint no-magic-numbers: [0]  */

function parse(source) {
  let comment = null;

  const ps = new FTLParserStream(source);

  ps.skipWSLines();

  const entries = [];

  while (ps.current()) {
    const entryStartPos = ps.getIndex();

    try {
      const entry = getEntry(ps);
      if (entryStartPos === 0 && entry.type === 'Comment') {
        comment = entry;
      } else {
        entry.addSpan(entryStartPos, ps.getIndex());
        entries.push(entry);
      }
    } catch (err) {
      if (!(err instanceof ParseError)) {
        throw err;
      }

      ps.skipToNextEntryStart();
      const nextEntryStart = ps.getIndex();

      // Create a Junk instance
      const slice = source.substring(entryStartPos, nextEntryStart);
      const junk = new Junk(slice);
      junk.addSpan(entryStartPos, nextEntryStart);
      junk.addAnnotation(err);
      entries.push(junk);
    }

    ps.skipWSLines();
  }

  return new Resource(entries, comment, source);
}

function getEntry(ps) {
  let comment;

  if (ps.currentIs('#')) {
    comment = getComment(ps);
  }

  if (ps.currentIs('[')) {
    return getSection(ps, comment);
  }

  if (ps.isIDStart()) {
    return getMessage(ps, comment);
  }

  if (comment) {
    return comment;
  }
  throw error(ps, 'Expected entry');
}

function getComment(ps) {
  ps.expectChar('#');
  ps.takeCharIf(' ');

  let content = '';

  while (true) {
    let ch;
    while ((ch = ps.takeChar(x => x !== '\n'))) {
      content += ch;
    }

    ps.next();

    if (ps.current() === '#') {
      content += '\n';
      ps.next();
      ps.takeCharIf(' ');
    } else {
      break;
    }
  }
  return new Comment(content);
}

function getSection(ps, comment) {
  ps.expectChar('[');
  ps.expectChar('[');

  ps.skipLineWS();

  const key = getKeyword(ps);

  ps.skipLineWS();

  ps.expectChar(']');
  ps.expectChar(']');

  ps.skipLineWS();

  ps.expectChar('\n');

  return new Section(key, comment);
}

function getMessage(ps, comment) {
  const id = getIdentifier(ps);

  ps.skipLineWS();

  let pattern;
  let attrs;

  if (ps.currentIs('=')) {
    ps.next();
    ps.skipLineWS();

    pattern = getPattern(ps);
  }

  if (ps.isPeekNextLineAttributeStart()) {
    attrs = getAttributes(ps);
  }

  if (pattern === undefined && attrs === undefined) {
    throw error(ps, 'Missing field');
  }

  return new Message(id, pattern, attrs, comment);
}

function getAttributes(ps) {
  const attrs = [];

  while (true) {
    ps.expectChar('\n');
    ps.skipLineWS();

    ps.expectChar('.');

    const key = getIdentifier(ps);

    ps.skipLineWS();

    ps.expectChar('=');

    ps.skipLineWS();

    const value = getPattern(ps);

    if (value === undefined) {
      throw error(ps, 'Expected field');
    }

    attrs.push(new Attribute(key, value));

    if (!ps.isPeekNextLineAttributeStart()) {
      break;
    }
  }
  return attrs;
}

function getIdentifier(ps) {
  let name = '';

  name += ps.takeIDStart();

  let ch;
  while ((ch = ps.takeIDChar())) {
    name += ch;
  }

  return new Identifier(name);
}

function getVariantKey(ps) {
  const ch = ps.current();

  if (!ch) {
    throw error(ps, 'Expected VariantKey');
  }

  const cc = ch.charCodeAt(0);

  if ((cc >= 48 && cc <= 57) || cc === 45) { // 0-9, -
    return getNumber(ps);
  }

  return getKeyword(ps);
}

function getVariants(ps) {
  const variants = [];
  let hasDefault = false;

  while (true) {
    let defaultIndex = false;

    ps.expectChar('\n');
    ps.skipLineWS();

    if (ps.currentIs('*')) {
      ps.next();
      defaultIndex = true;
      hasDefault = true;
    }

    ps.expectChar('[');

    const key = getVariantKey(ps);

    ps.expectChar(']');

    ps.skipLineWS();

    const value = getPattern(ps);

    if (!value) {
      throw error(ps, 'Expected field');
    }

    variants.push(new Variant(key, value, defaultIndex));

    if (!ps.isPeekNextLineVariantStart()) {
      break;
    }
  }

  if (!hasDefault) {
    throw error(ps, 'Missing default variant');
  }

  return variants;
}

function getKeyword(ps) {
  let name = '';

  name += ps.takeIDStart();

  while (true) {
    const ch = ps.takeKWChar();
    if (ch) {
      name += ch;
    } else {
      break;
    }
  }

  return new Keyword(name.trimRight());
}

function getDigits(ps) {
  let num = '';

  let ch;
  while ((ch = ps.takeDigit())) {
    num += ch;
  }

  if (num.length === 0) {
    throw error(ps, 'Expected char range');
  }

  return num;
}

function getNumber(ps) {
  let num = '';

  if (ps.currentIs('-')) {
    num += '-';
    ps.next();
  }

  num = `${num}${getDigits(ps)}`;

  if (ps.currentIs('.')) {
    num += '.';
    ps.next();
    num = `${num}${getDigits(ps)}`;
  }

  return new NumberExpression(num);
}

function getPattern(ps) {
  let buffer = '';
  const elements = [];
  let quoteDelimited = false;
  let quoteOpen = false;
  let firstLine = true;
  let isIndented = false;

  if (ps.takeCharIf('"')) {
    quoteDelimited = true;
    quoteOpen = true;
  }

  let ch;
  while ((ch = ps.current())) {
    if (ch === '\n') {
      if (quoteDelimited) {
        throw error(ps, 'Expected roken');
      }

      if (firstLine && buffer.length !== 0) {
        break;
      }

      ps.peek();

      ps.peekLineWS();

      if (!ps.currentPeekIs('|')) {
        ps.resetPeek();
        break;
      } else {
        ps.skipToPeek();
        ps.next();
      }

      if (firstLine) {
        if (ps.takeCharIf(' ')) {
          isIndented = true;
        }
      } else {
        if (isIndented && !ps.takeCharIf(' ')) {
          throw error(ps, 'Generic');
        }
      }

      firstLine = false;

      if (buffer.length !== 0) {
        buffer += ch;
      }
      continue;
    } else if (ch === '\\') {
      const ch2 = ps.peek();
      if (ch2 === '{' || ch2 === '"') {
        buffer += ch2;
      } else {
        buffer += ch + ch2;
      }
      ps.next();
    } else if (ch === '{') {
      ps.next();

      ps.skipLineWS();

      if (buffer.length !== 0) {
        elements.push(new StringExpression(buffer));
      }

      buffer = '';

      elements.push(getExpression(ps));

      ps.expectChar('}');

      continue;
    } else if (ch === '"' && quoteOpen) {
      ps.next();
      quoteOpen = false;
      break;
    } else {
      buffer += ps.ch;
    }
    ps.next();
  }

  if (buffer.length !== 0) {
    elements.push(new StringExpression(buffer));
  }

  return new Pattern(elements, false);
}

function getExpression(ps) {
  if (ps.isPeekNextLineVariantStart()) {
    const variants = getVariants(ps);

    ps.expectChar('\n');

    return new SelectExpression(null, variants);
  }

  const selector = getSelectorExpression(ps);

  ps.skipLineWS();

  if (ps.currentIs('-')) {
    ps.peek();
    if (!ps.currentPeekIs('>')) {
      ps.resetPeek();
    } else {
      ps.next();
      ps.next();

      ps.skipLineWS();

      const variants = getVariants(ps);

      if (variants.length === 0) {
        throw error(ps, 'Missing variants');
      }

      ps.expectChar('\n');

      return new SelectExpression(selector, variants);
    }
  }

  return selector;
}

function getSelectorExpression(ps) {
  const literal = getLiteral(ps);

  if (literal.type !== 'MessageReference') {
    return literal;
  }

  const ch = ps.current();

  if (ch === '.') {
    ps.next();

    const attr = getIdentifier(ps);
    return new AttributeExpression(literal.id, attr);
  }

  if (ch === '[') {
    ps.next();

    const key = getVariantKey(ps);

    ps.expectChar(']');

    return new VariantExpression(literal.id, key);
  }

  if (ch === '(') {
    ps.next();

    const args = getCallArgs(ps);

    ps.expectChar(')');

    return new CallExpression(literal.id, args);
  }

  return literal;
}

function getCallArgs(ps) {
  const args = [];

  ps.skipLineWS();

  while (true) {
    if (ps.current() === ')') {
      break;
    }

    const exp = getSelectorExpression(ps);

    ps.skipLineWS();

    if (ps.current() === ':') {
      if (exp.type !== 'MessageReference') {
        throw error(ps, 'Forbidden key');
      }

      ps.next();
      ps.skipLineWS();

      const val = getArgVal(ps);

      args.push(new NamedArgument(exp.id, val));
    } else {
      args.push(exp);
    }

    ps.skipLineWS();

    if (ps.current() === ',') {
      ps.next();
      ps.skipLineWS();
      continue;
    } else {
      break;
    }
  }
  return args;
}

function getArgVal(ps) {
  if (ps.isNumberStart()) {
    return getNumber(ps);
  } else if (ps.currentIs('"')) {
    return getString(ps);
  }
  throw error(ps, 'Expected field');
}

function getString(ps) {
  let val = '';

  ps.expectChar('"');

  let ch;
  while ((ch = ps.takeChar(x => x !== '"'))) {
    val += ch;
  }

  ps.next();

  return new StringExpression(val);

}

function getLiteral(ps) {
  const ch = ps.current();

  if (!ch) {
    throw error(ps, 'Expected literal');
  }

  if (ps.isNumberStart()) {
    return getNumber(ps);
  } else if (ch === '"') {
    return getPattern(ps);
  } else if (ch === '$') {
    ps.next();
    const name = getIdentifier(ps);
    return new ExternalArgument(name);
  }

  const name = getIdentifier(ps);
  return new MessageReference(name);

}

function lineOffset(source, pos) {
  // Substract 1 to get the offset.
  return source.substring(0, pos).split('\n').length - 1;
}

function columnOffset(source, pos) {
  const lastLineBreak = source.lastIndexOf('\n', pos);
  return lastLineBreak === -1
    ? pos
    // Substracting two offsets gives length; substract 1 to get the offset.
    : pos - lastLineBreak - 1;
}

exports.lineOffset = lineOffset;
exports.columnOffset = columnOffset;
exports.Resource = Resource;
exports.Entry = Entry;
exports.Message = Message;
exports.Pattern = Pattern;
exports.Expression = Expression;
exports.StringExpression = StringExpression;
exports.NumberExpression = NumberExpression;
exports.MessageReference = MessageReference;
exports.ExternalArgument = ExternalArgument;
exports.SelectExpression = SelectExpression;
exports.AttributeExpression = AttributeExpression;
exports.VariantExpression = VariantExpression;
exports.CallExpression = CallExpression;
exports.Attribute = Attribute;
exports.Variant = Variant;
exports.NamedArgument = NamedArgument;
exports.Identifier = Identifier;
exports.Keyword = Keyword;
exports.Comment = Comment;
exports.Section = Section;
exports.Function = Function;
exports.Junk = Junk;
exports.parse = parse;

Object.defineProperty(exports, '__esModule', { value: true });

})));
