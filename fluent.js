(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.Fluent = global.Fluent || {})));
}(this, (function (exports) { 'use strict';

/*  eslint no-magic-numbers: [0]  */

const locales2rules = {
  'af': 3,
  'ak': 4,
  'am': 4,
  'ar': 1,
  'asa': 3,
  'az': 0,
  'be': 11,
  'bem': 3,
  'bez': 3,
  'bg': 3,
  'bh': 4,
  'bm': 0,
  'bn': 3,
  'bo': 0,
  'br': 20,
  'brx': 3,
  'bs': 11,
  'ca': 3,
  'cgg': 3,
  'chr': 3,
  'cs': 12,
  'cy': 17,
  'da': 3,
  'de': 3,
  'dv': 3,
  'dz': 0,
  'ee': 3,
  'el': 3,
  'en': 3,
  'eo': 3,
  'es': 3,
  'et': 3,
  'eu': 3,
  'fa': 0,
  'ff': 5,
  'fi': 3,
  'fil': 4,
  'fo': 3,
  'fr': 5,
  'fur': 3,
  'fy': 3,
  'ga': 8,
  'gd': 24,
  'gl': 3,
  'gsw': 3,
  'gu': 3,
  'guw': 4,
  'gv': 23,
  'ha': 3,
  'haw': 3,
  'he': 2,
  'hi': 4,
  'hr': 11,
  'hu': 0,
  'id': 0,
  'ig': 0,
  'ii': 0,
  'is': 3,
  'it': 3,
  'iu': 7,
  'ja': 0,
  'jmc': 3,
  'jv': 0,
  'ka': 0,
  'kab': 5,
  'kaj': 3,
  'kcg': 3,
  'kde': 0,
  'kea': 0,
  'kk': 3,
  'kl': 3,
  'km': 0,
  'kn': 0,
  'ko': 0,
  'ksb': 3,
  'ksh': 21,
  'ku': 3,
  'kw': 7,
  'lag': 18,
  'lb': 3,
  'lg': 3,
  'ln': 4,
  'lo': 0,
  'lt': 10,
  'lv': 6,
  'mas': 3,
  'mg': 4,
  'mk': 16,
  'ml': 3,
  'mn': 3,
  'mo': 9,
  'mr': 3,
  'ms': 0,
  'mt': 15,
  'my': 0,
  'nah': 3,
  'naq': 7,
  'nb': 3,
  'nd': 3,
  'ne': 3,
  'nl': 3,
  'nn': 3,
  'no': 3,
  'nr': 3,
  'nso': 4,
  'ny': 3,
  'nyn': 3,
  'om': 3,
  'or': 3,
  'pa': 3,
  'pap': 3,
  'pl': 13,
  'ps': 3,
  'pt': 3,
  'rm': 3,
  'ro': 9,
  'rof': 3,
  'ru': 11,
  'rwk': 3,
  'sah': 0,
  'saq': 3,
  'se': 7,
  'seh': 3,
  'ses': 0,
  'sg': 0,
  'sh': 11,
  'shi': 19,
  'sk': 12,
  'sl': 14,
  'sma': 7,
  'smi': 7,
  'smj': 7,
  'smn': 7,
  'sms': 7,
  'sn': 3,
  'so': 3,
  'sq': 3,
  'sr': 11,
  'ss': 3,
  'ssy': 3,
  'st': 3,
  'sv': 3,
  'sw': 3,
  'syr': 3,
  'ta': 3,
  'te': 3,
  'teo': 3,
  'th': 0,
  'ti': 4,
  'tig': 3,
  'tk': 3,
  'tl': 4,
  'tn': 3,
  'to': 0,
  'tr': 0,
  'ts': 3,
  'tzm': 22,
  'uk': 11,
  'ur': 3,
  've': 3,
  'vi': 0,
  'vun': 3,
  'wa': 4,
  'wae': 3,
  'wo': 0,
  'xh': 3,
  'xog': 3,
  'yo': 0,
  'zh': 0,
  'zu': 3
};

// utility functions for plural rules methods
function isIn(n, list) {
  return list.indexOf(n) !== -1;
}
function isBetween(n, start, end) {
  return typeof n === typeof start && start <= n && n <= end;
}

// list of all plural rules methods:
// map an integer to the plural form name to use
const pluralRules = {
  '0': function() {
    return 'other';
  },
  '1': function(n) {
    if ((isBetween((n % 100), 3, 10))) {
      return 'few';
    }
    if (n === 0) {
      return 'zero';
    }
    if ((isBetween((n % 100), 11, 99))) {
      return 'many';
    }
    if (n === 2) {
      return 'two';
    }
    if (n === 1) {
      return 'one';
    }
    return 'other';
  },
  '2': function(n) {
    if (n !== 0 && (n % 10) === 0) {
      return 'many';
    }
    if (n === 2) {
      return 'two';
    }
    if (n === 1) {
      return 'one';
    }
    return 'other';
  },
  '3': function(n) {
    if (n === 1) {
      return 'one';
    }
    return 'other';
  },
  '4': function(n) {
    if ((isBetween(n, 0, 1))) {
      return 'one';
    }
    return 'other';
  },
  '5': function(n) {
    if ((isBetween(n, 0, 2)) && n !== 2) {
      return 'one';
    }
    return 'other';
  },
  '6': function(n) {
    if (n === 0) {
      return 'zero';
    }
    if ((n % 10) === 1 && (n % 100) !== 11) {
      return 'one';
    }
    return 'other';
  },
  '7': function(n) {
    if (n === 2) {
      return 'two';
    }
    if (n === 1) {
      return 'one';
    }
    return 'other';
  },
  '8': function(n) {
    if ((isBetween(n, 3, 6))) {
      return 'few';
    }
    if ((isBetween(n, 7, 10))) {
      return 'many';
    }
    if (n === 2) {
      return 'two';
    }
    if (n === 1) {
      return 'one';
    }
    return 'other';
  },
  '9': function(n) {
    if (n === 0 || n !== 1 && (isBetween((n % 100), 1, 19))) {
      return 'few';
    }
    if (n === 1) {
      return 'one';
    }
    return 'other';
  },
  '10': function(n) {
    if ((isBetween((n % 10), 2, 9)) && !(isBetween((n % 100), 11, 19))) {
      return 'few';
    }
    if ((n % 10) === 1 && !(isBetween((n % 100), 11, 19))) {
      return 'one';
    }
    return 'other';
  },
  '11': function(n) {
    if ((isBetween((n % 10), 2, 4)) && !(isBetween((n % 100), 12, 14))) {
      return 'few';
    }
    if ((n % 10) === 0 ||
        (isBetween((n % 10), 5, 9)) ||
        (isBetween((n % 100), 11, 14))) {
      return 'many';
    }
    if ((n % 10) === 1 && (n % 100) !== 11) {
      return 'one';
    }
    return 'other';
  },
  '12': function(n) {
    if ((isBetween(n, 2, 4))) {
      return 'few';
    }
    if (n === 1) {
      return 'one';
    }
    return 'other';
  },
  '13': function(n) {
    if (n % 1 !== 0) {
      return 'other';
    }
    if ((isBetween((n % 10), 2, 4)) && !(isBetween((n % 100), 12, 14))) {
      return 'few';
    }
    if (n !== 1 && (isBetween((n % 10), 0, 1)) ||
        (isBetween((n % 10), 5, 9)) ||
        (isBetween((n % 100), 12, 14))) {
      return 'many';
    }
    if (n === 1) {
      return 'one';
    }
    return 'other';
  },
  '14': function(n) {
    if ((isBetween((n % 100), 3, 4))) {
      return 'few';
    }
    if ((n % 100) === 2) {
      return 'two';
    }
    if ((n % 100) === 1) {
      return 'one';
    }
    return 'other';
  },
  '15': function(n) {
    if (n === 0 || (isBetween((n % 100), 2, 10))) {
      return 'few';
    }
    if ((isBetween((n % 100), 11, 19))) {
      return 'many';
    }
    if (n === 1) {
      return 'one';
    }
    return 'other';
  },
  '16': function(n) {
    if ((n % 10) === 1 && n !== 11) {
      return 'one';
    }
    return 'other';
  },
  '17': function(n) {
    if (n === 3) {
      return 'few';
    }
    if (n === 0) {
      return 'zero';
    }
    if (n === 6) {
      return 'many';
    }
    if (n === 2) {
      return 'two';
    }
    if (n === 1) {
      return 'one';
    }
    return 'other';
  },
  '18': function(n) {
    if (n === 0) {
      return 'zero';
    }
    if ((isBetween(n, 0, 2)) && n !== 0 && n !== 2) {
      return 'one';
    }
    return 'other';
  },
  '19': function(n) {
    if ((isBetween(n, 2, 10))) {
      return 'few';
    }
    if ((isBetween(n, 0, 1))) {
      return 'one';
    }
    return 'other';
  },
  '20': function(n) {
    if ((isBetween((n % 10), 3, 4) || ((n % 10) === 9)) && !(
        isBetween((n % 100), 10, 19) ||
        isBetween((n % 100), 70, 79) ||
        isBetween((n % 100), 90, 99)
        )) {
      return 'few';
    }
    if ((n % 1000000) === 0 && n !== 0) {
      return 'many';
    }
    if ((n % 10) === 2 && !isIn((n % 100), [12, 72, 92])) {
      return 'two';
    }
    if ((n % 10) === 1 && !isIn((n % 100), [11, 71, 91])) {
      return 'one';
    }
    return 'other';
  },
  '21': function(n) {
    if (n === 0) {
      return 'zero';
    }
    if (n === 1) {
      return 'one';
    }
    return 'other';
  },
  '22': function(n) {
    if ((isBetween(n, 0, 1)) || (isBetween(n, 11, 99))) {
      return 'one';
    }
    return 'other';
  },
  '23': function(n) {
    if ((isBetween((n % 10), 1, 2)) || (n % 20) === 0) {
      return 'one';
    }
    return 'other';
  },
  '24': function(n) {
    if ((isBetween(n, 3, 10) || isBetween(n, 13, 19))) {
      return 'few';
    }
    if (isIn(n, [2, 12])) {
      return 'two';
    }
    if (isIn(n, [1, 11])) {
      return 'one';
    }
    return 'other';
  }
};

function getPluralRule(code) {
  // return a function that gives the plural form name for a given integer
  const index = locales2rules[code.replace(/-.*$/, '')];
  if (!(index in pluralRules)) {
    return () => 'other';
  }
  return pluralRules[index];
}

/**
 * The `FTLType` class is the base of FTL's type system.
 *
 * FTL types wrap JavaScript values and store additional configuration for
 * them, which can then be used in the `toString` method together with a proper
 * `Intl` formatter.
 */
class FTLType {

  /**
   * Create an `FTLType` instance.
   *
   * @param   {Any}    value - JavaScript value to wrap.
   * @param   {Object} opts  - Configuration.
   * @returns {FTLType}
   */
  constructor(value, opts) {
    this.value = value;
    this.opts = opts;
  }

  /**
   * Get the JavaScript value wrapped by this `FTLType` instance.
   *
   * @returns {Any}
   */
  valueOf() {
    return this.value;
  }

  /**
   * Stringify an instance of `FTLType`.
   *
   * This method can use `Intl` formatters memoized by the `MessageContext`
   * instance passed as an argument.
   *
   * @param   {MessageContext} ctx
   * @returns {string}
   */
  toString(ctx) {
    return this.value.toString(ctx);
  }
}

class FTLNone extends FTLType {
  toString() {
    return this.value || '???';
  }
}

class FTLNumber extends FTLType {
  constructor(value, opts) {
    super(parseFloat(value), opts);
  }
  toString(ctx) {
    const nf = ctx._memoizeIntlObject(
      Intl.NumberFormat, this.opts
    );
    return nf.format(this.value);
  }
}

class FTLDateTime extends FTLType {
  constructor(value, opts) {
    super(new Date(value), opts);
  }
  toString(ctx) {
    const dtf = ctx._memoizeIntlObject(
      Intl.DateTimeFormat, this.opts
    );
    return dtf.format(this.value);
  }
}

class FTLKeyword extends FTLType {
  toString() {
    const { name, namespace } = this.value;
    return namespace ? `${namespace}:${name}` : name;
  }
  match(ctx, other) {
    const { name, namespace } = this.value;
    if (other instanceof FTLKeyword) {
      return name === other.value.name && namespace === other.value.namespace;
    } else if (namespace) {
      return false;
    } else if (typeof other === 'string') {
      return name === other;
    } else if (other instanceof FTLNumber) {
      const pr = ctx._memoizeIntlObject(
        Intl.PluralRules, other.opts
      );
      return name === pr.select(other.valueOf());
    }
    return false;
  }
}

/**
 * @module
 *
 * The FTL resolver ships with a number of functions built-in.
 *
 * Each function take two arguments:
 *   - args - an array of positional args
 *   - opts - an object of key-value args
 *
 * Arguments to functions are guaranteed to already be instances of `FTLType`.
 * Functions must return `FTLType` objects as well.  For this reason it may be
 * necessary to unwrap the JavaScript value behind the FTL Value and to merge
 * the configuration of the argument with the configuration of the return
 * value.
 */
var builtins = {
  'NUMBER': ([arg], opts) =>
    new FTLNumber(arg.valueOf(), merge(arg.opts, opts)),
  'DATETIME': ([arg], opts) =>
    new FTLDateTime(arg.valueOf(), merge(arg.opts, opts)),
};

function merge(argopts, opts) {
  return Object.assign({}, argopts, valuesOf(opts));
}

function valuesOf(opts) {
  return Object.keys(opts).reduce(
    (seq, cur) => Object.assign({}, seq, {
      [cur]: opts[cur].valueOf()
    }), {});
}

/**
 * @module
 *
 * The role of the FTL resolver is to format a translation object to an
 * instance of `FTLType`.
 *
 * Translations can contain references to other messages or external arguments,
 * conditional logic in form of select expressions, traits which describe their
 * grammatical features, and can use FTL builtins which make use of the `Intl`
 * formatters to format numbers, dates, lists and more into the context's
 * language.  See the documentation of the FTL syntax for more information.
 *
 * In case of errors the resolver will try to salvage as much of the
 * translation as possible.  In rare situations where the resolver didn't know
 * how to recover from an error it will return an instance of `FTLNone`.
 *
 * `MessageReference`, `VariantExpression`, `AttributeExpression` and
 * `SelectExpression` resolve to raw Runtime Entries objects and the result of
 * the resolution needs to be passed into `Value` to get their real value.
 * This is useful for composing expressions.  Consider:
 *
 *     brand-name[nominative]
 *
 * which is a `VariantExpression` with properties `id: MessageReference` and
 * `key: Keyword`.  If `MessageReference` was resolved eagerly, it would
 * instantly resolve to the value of the `brand-name` message.  Instead, we
 * want to get the message object and look for its `nominative` variant.
 *
 * All other expressions (except for `FunctionReference` which is only used in
 * `CallExpression`) resolve to an instance of `FTLType`, which must then be
 * sringified with its `toString` method by the caller.
 */

// Prevent expansion of too long placeables.
const MAX_PLACEABLE_LENGTH = 2500;

// Unicode bidi isolation characters.
const FSI = '\u2068';
const PDI = '\u2069';


/**
 * Helper for choosing the default value from a set of members.
 *
 * Used in SelectExpressions and Value.
 *
 * @private
 */
function DefaultMember(env, members, def) {
  if (members[def]) {
    return members[def];
  }

  const { errors } = env;
  errors.push(new RangeError('No default'));
  return new FTLNone();
}


/**
 * Resolve a reference to a message to the message object.
 *
 * @private
 */
function MessageReference(env, {name}) {
  const { ctx, errors } = env;
  const message = ctx.messages.get(name);

  if (!message) {
    errors.push(new ReferenceError(`Unknown message: ${name}`));
    return new FTLNone(name);
  }

  return message;
}


/**
 * Resolve a variant expression to the variant object.
 *
 * @private
 */
function VariantExpression(env, {id, key}) {
  const message = MessageReference(env, id);
  if (message instanceof FTLNone) {
    return message;
  }

  const { ctx, errors } = env;
  const keyword = Value(env, key);

  function isVariantList(node) {
    return Array.isArray(node) &&
      node[0].type === 'sel' &&
      node[0].exp === null;
  }

  if (isVariantList(message.val)) {
    // Match the specified key against keys of each variant, in order.
    for (const variant of message.val[0].vars) {
      const variantKey = Value(env, variant.key);
      if (keyword.match(ctx, variantKey)) {
        return variant;
      }
    }
  }

  errors.push(new ReferenceError(`Unknown variant: ${keyword.toString(ctx)}`));
  return Value(env, message);
}


/**
 * Resolve an attribute expression to the attribute object.
 *
 * @private
 */
function AttributeExpression(env, {id, name}) {
  const message = MessageReference(env, id);
  if (message instanceof FTLNone) {
    return message;
  }

  if (message.attrs) {
    // Match the specified name against keys of each attribute.
    for (const attrName in message.attrs) {
      if (name === attrName) {
        return message.attrs[name];
      }
    }
  }

  const { errors } = env;
  errors.push(new ReferenceError(`Unknown attribute: ${name}`));
  return Value(env, message);
}

/**
 * Resolve a select expression to the member object.
 *
 * @private
 */
function SelectExpression(env, {exp, vars, def}) {
  if (exp === null) {
    return DefaultMember(env, vars, def);
  }

  const selector = Value(env, exp);
  if (selector instanceof FTLNone) {
    return DefaultMember(env, vars, def);
  }

  // Match the selector against keys of each variant, in order.
  for (const variant of vars) {
    const key = Value(env, variant.key);

    // XXX A special case of numbers to avoid code repetition in types.js.
    if (key instanceof FTLNumber &&
        selector instanceof FTLNumber &&
        key.valueOf() === selector.valueOf()) {
      return variant;
    }

    const { ctx } = env;

    if (key instanceof FTLKeyword && key.match(ctx, selector)) {
      return variant;
    }
  }

  return DefaultMember(env, vars, def);
}


/**
 * Resolve expression to an FTL type.
 *
 * JavaScript strings are a special case.  Since they natively have the
 * `toString` method they can be used as if they were an FTL type without
 * paying the cost of creating a instance of one.
 *
 * @param   {Object} expr
 * @returns {FTLType}
 * @private
 */
function Value(env, expr) {
  // A fast-path for strings which are the most common case, and for `FTLNone`
  // which doesn't require any additional logic.
  if (typeof expr === 'string' || expr instanceof FTLNone) {
    return expr;
  }

  // The Runtime AST (Entries) encodes patterns (complex strings with
  // placeables) as Arrays.
  if (Array.isArray(expr)) {
    return Pattern(env, expr);
  }


  switch (expr.type) {
    case 'kw':
      return new FTLKeyword(expr);
    case 'num':
      return new FTLNumber(expr.val);
    case 'ext':
      return ExternalArgument(env, expr);
    case 'fun':
      return FunctionReference(env, expr);
    case 'call':
      return CallExpression(env, expr);
    case 'ref': {
      const message = MessageReference(env, expr);
      return Value(env, message);
    }
    case 'attr': {
      const attr = AttributeExpression(env, expr);
      return Value(env, attr);
    }
    case 'var': {
      const variant = VariantExpression(env, expr);
      return Value(env, variant);
    }
    case 'sel': {
      const member = SelectExpression(env, expr);
      return Value(env, member);
    }
    case undefined: {
      // If it's a node with a value, resolve the value.
      if (expr.val !== undefined) {
        return Value(env, expr.val);
      }

      const { errors } = env;
      errors.push(new RangeError('No value'));
      return new FTLNone();
    }
    default:
      return new FTLNone();
  }
}

/**
 * Resolve a reference to an external argument.
 *
 * @private
 */
function ExternalArgument(env, {name}) {
  const { args, errors } = env;

  if (!args || !args.hasOwnProperty(name)) {
    errors.push(new ReferenceError(`Unknown external: ${name}`));
    return new FTLNone(name);
  }

  const arg = args[name];

  if (arg instanceof FTLType) {
    return arg;
  }

  // Convert the argument to an FTL type.
  switch (typeof arg) {
    case 'string':
      return arg;
    case 'number':
      return new FTLNumber(arg);
    case 'object':
      if (arg instanceof Date) {
        return new FTLDateTime(arg);
      }
    default:
      errors.push(
        new TypeError(`Unsupported external type: ${name}, ${typeof arg}`)
      );
      return new FTLNone(name);
  }
}

/**
 * Resolve a reference to a function.
 *
 * @private
 */
function FunctionReference(env, {name}) {
  // Some functions are built-in.  Others may be provided by the runtime via
  // the `MessageContext` constructor.
  const { ctx: { functions }, errors } = env;
  const func = functions[name] || builtins[name];

  if (!func) {
    errors.push(new ReferenceError(`Unknown function: ${name}()`));
    return new FTLNone(`${name}()`);
  }

  if (typeof func !== 'function') {
    errors.push(new TypeError(`Function ${name}() is not callable`));
    return new FTLNone(`${name}()`);
  }

  return func;
}

/**
 * Resolve a call to a Function with positional and key-value arguments.
 *
 * @private
 */
function CallExpression(env, {fun, args}) {
  const callee = FunctionReference(env, fun);

  if (callee instanceof FTLNone) {
    return callee;
  }

  const posargs = [];
  const keyargs = [];

  for (const arg of args) {
    if (arg.type === 'narg') {
      keyargs[arg.name] = Value(env, arg.val);
    } else {
      posargs.push(Value(env, arg));
    }
  }

  // XXX functions should also report errors
  return callee(posargs, keyargs);
}

/**
 * Resolve a pattern (a complex string with placeables).
 *
 * @private
 */
function Pattern(env, ptn) {
  const { ctx, dirty, errors } = env;

  if (dirty.has(ptn)) {
    errors.push(new RangeError('Cyclic reference'));
    return new FTLNone();
  }

  // Tag the pattern as dirty for the purpose of the current resolution.
  dirty.add(ptn);
  let result = '';

  for (const part of ptn) {
    if (typeof part === 'string') {
      result += part;
    } else {
      let str = Value(env, part).toString(ctx);

      if (str.length > MAX_PLACEABLE_LENGTH) {
        errors.push(
          new RangeError(
            'Too many characters in placeable ' +
            `(${str.length}, max allowed is ${MAX_PLACEABLE_LENGTH})`
          )
        );
        str = str.substr(0, MAX_PLACEABLE_LENGTH);
      }

      if (ctx.useIsolating) {
        result += `${FSI}${str}${PDI}`;
      } else {
        result += str;
      }
    }
  }

  dirty.delete(ptn);
  return result;
}

/**
 * Format a translation into an `FTLType`.
 *
 * The return value must be sringified with its `toString` method by the
 * caller.
 *
 * @param   {MessageContext} ctx
 * @param   {Object}         args
 * @param   {Object}         message
 * @param   {Array}          errors
 * @returns {FTLType}
 */
function resolve(ctx, args, message, errors = []) {
  const env = {
    ctx, args, errors, dirty: new WeakSet()
  };
  return Value(env, message);
}

/**
 * An `L10nError` with information about language and message ID in which
 * the error happened.
 */
class L10nError extends Error {
  constructor(message, id, lang) {
    super();
    this.name = 'L10nError';
    this.message = message;
    this.id = id;
    this.lang = lang;
  }
}

/*  eslint no-magic-numbers: [0]  */

const MAX_PLACEABLES = 100;

/**
 * The `Parser` class is responsible for parsing FTL resources.
 *
 * It's only public method is `getResource(source)` which takes an FTL
 * string and returns a two element Array with an Object of entries
 * generated from the source as the first element and an array of L10nError
 * objects as the second.
 *
 * This parser is optimized for runtime performance.
 *
 * There is an equivalent of this parser in ftl/ast/parser which is
 * generating full AST which is useful for FTL tools.
 */
class EntriesParser {
  /**
   * @param {string} string
   * @returns {{}, []]}
   */
  getResource(string) {
    this._source = string;
    this._index = 0;
    this._length = string.length;

    // This variable is used for error recovery and reporting.
    this._lastGoodEntryEnd = 0;

    const entries = {};
    const errors = [];

    this.getWS();
    while (this._index < this._length) {
      try {
        this.getEntry(entries);
      } catch (e) {
        if (e instanceof L10nError) {
          errors.push(e);
          this.getJunkEntry();
        } else {
          throw e;
        }
      }
      this.getWS();
    }

    return [entries, errors];
  }

  getEntry(entries) {
    // The pointer here should either be at the beginning of the file
    // or right after new line.
    if (this._index !== 0 &&
        this._source[this._index - 1] !== '\n') {
      throw this.error('Expected new line and a new entry');
    }

    const ch = this._source[this._index];

    // We don't care about comments or sections at runtime
    if (ch === '#') {
      this.getComment();
      return;
    }

    if (ch === '[') {
      this.getSection();
      return;
    }

    if (ch !== '\n') {
      this.getMessage(entries);
    }
  }

  getSection() {
    this._index += 1;
    if (this._source[this._index] !== '[') {
      throw this.error('Expected "[[" to open a section');
    }

    this._index += 1;

    this.getLineWS();
    this.getKeyword();
    this.getLineWS();

    if (this._source[this._index] !== ']' ||
        this._source[this._index + 1] !== ']') {
      throw this.error('Expected "]]" to close a section');
    }

    this._index += 2;

    // sections are ignored in the runtime ast
    return undefined;
  }

  getMessage(entries) {
    const id = this.getIdentifier();

    this.getLineWS();

    let ch = this._source[this._index];

    let val;

    if (ch === '=') {
      this._index++;

      this.getLineWS();

      val = this.getPattern();
    }


    ch = this._source[this._index];

    // In the scenario when the pattern is quote-delimited
    // the pattern ends with the closing quote.
    if (ch === '\n') {
      this._index++;
      this.getLineWS();
      ch = this._source[this._index];
    }

    if (ch === '.') {

      const attrs = this.getAttributes();
      entries[id] = {
        attrs: attrs,
        val
      };

    } else if (typeof val === 'string') {
      entries[id] = val;
    } else if (val === undefined) {
      throw this.error(`Expected a value (like: " = value") or
        an attribute (like: ".key = value")`);
    } else {
      entries[id] = {
        val
      };
    }
  }

  getWS() {
    let cc = this._source.charCodeAt(this._index);
    // space, \n, \t, \r
    while (cc === 32 || cc === 10 || cc === 9 || cc === 13) {
      cc = this._source.charCodeAt(++this._index);
    }
  }

  getLineWS() {
    let cc = this._source.charCodeAt(this._index);
    // space, \t
    while (cc === 32 || cc === 9) {
      cc = this._source.charCodeAt(++this._index);
    }
  }

  getIdentifier() {
    const start = this._index;
    let cc = this._source.charCodeAt(this._index);

    if ((cc >= 97 && cc <= 122) || // a-z
        (cc >= 65 && cc <= 90) ||  // A-Z
        cc === 95) {               // _
      cc = this._source.charCodeAt(++this._index);
    } else {
      throw this.error('Expected an identifier (starting with [a-zA-Z_])');
    }

    while ((cc >= 97 && cc <= 122) || // a-z
           (cc >= 65 && cc <= 90) ||  // A-Z
           (cc >= 48 && cc <= 57) ||  // 0-9
           cc === 95 || cc === 45) {  // _-
      cc = this._source.charCodeAt(++this._index);
    }

    return this._source.slice(start, this._index);
  }

  getKeyword() {
    let name = '';

    const start = this._index;
    let cc = this._source.charCodeAt(this._index);

    if ((cc >= 97 && cc <= 122) || // a-z
        (cc >= 65 && cc <= 90) ||  // A-Z
        cc === 95 || cc === 32) {  //  _
      cc = this._source.charCodeAt(++this._index);
    } else if (name.length === 0) {
      throw this.error('Expected a keyword (starting with [a-zA-Z_])');
    }

    while ((cc >= 97 && cc <= 122) || // a-z
           (cc >= 65 && cc <= 90) ||  // A-Z
           (cc >= 48 && cc <= 57) ||  // 0-9
           cc === 95 || cc === 45 || cc === 32) {  //  _-
      cc = this._source.charCodeAt(++this._index);
    }

    // If we encountered the end of name, we want to test is the last
    // collected character is a space.
    // If it is, we will backtrack to the last non-space character because
    // the keyword cannot end with a space character.
    while (this._source.charCodeAt(this._index - 1) === 32) {
      this._index--;
    }

    name += this._source.slice(start, this._index);

    return { type: 'kw', name };
  }

  // We're going to first try to see if the pattern is simple.
  // If it is a simple, not quote-delimited string,
  // we can just look for the end of the line and read the string.
  //
  // Then, if either the line contains a placeable opening `{` or the
  // next line starts with a pipe `|`, we switch to complex pattern.
  getPattern() {
    const start = this._index;
    if (this._source[start] === '"') {
      return this.getComplexPattern();
    }
    let eol = this._source.indexOf('\n', this._index);

    if (eol === -1) {
      eol = this._length;
    }

    const line = start !== eol ?
      this._source.slice(start, eol) : undefined;

    if (line !== undefined && line.includes('{')) {
      return this.getComplexPattern();
    }

    this._index = eol + 1;

    this.getLineWS();

    if (this._source[this._index] === '|') {
      this._index = start;
      return this.getComplexPattern();
    }

    return line;
  }

  /* eslint-disable complexity */
  getComplexPattern() {
    let buffer = '';
    const content = [];
    let placeables = 0;

    // We actually use all three possible states of this variable:
    // true and false indicate if we're within a quote-delimited string
    // null indicates that the string is not quote-delimited
    let quoteDelimited = null;
    let firstLine = true;

    let ch = this._source[this._index];

    // If the string starts with \", \{ or \\ skip the first `\` and add the
    // following character to the buffer without interpreting it.
    if (ch === '\\' &&
      (this._source[this._index + 1] === '"' ||
       this._source[this._index + 1] === '{' ||
       this._source[this._index + 1] === '\\')) {
      buffer += this._source[this._index + 1];
      this._index += 2;
      ch = this._source[this._index];
    } else if (ch === '"') {
      // If the first character of the string is `"`, mark the string
      // as quote delimited.
      quoteDelimited = true;
      this._index++;
      ch = this._source[this._index];
    }

    while (this._index < this._length) {
      // This block handles multi-line strings combining strings seaprated
      // by new line and `|` character at the beginning of the next one.
      if (ch === '\n') {
        if (quoteDelimited) {
          throw this.error('Unclosed string');
        }
        this._index++;
        this.getLineWS();
        if (this._source[this._index] !== '|') {
          break;
        }
        if (firstLine && buffer.length) {
          throw this.error('Multiline string should have the ID line empty');
        }
        firstLine = false;
        this._index++;
        if (this._source[this._index] === ' ') {
          this._index++;
        }
        if (buffer.length) {
          buffer += '\n';
        }
        ch = this._source[this._index];
        continue;
      } else if (ch === '\\') {
        // We only handle `{` as a character that can be escaped in a string
        // and `"` if the string is quote delimited.
        const ch2 = this._source[this._index + 1];
        if ((quoteDelimited && ch2 === '"') ||
            ch2 === '{') {
          ch = ch2;
          this._index++;
        }
      } else if (quoteDelimited && ch === '"') {
        this._index++;
        quoteDelimited = false;
        break;
      } else if (ch === '{') {
        // Push the buffer to content array right before placeable
        if (buffer.length) {
          content.push(buffer);
        }
        if (placeables > MAX_PLACEABLES - 1) {
          throw this.error(
            `Too many placeables, maximum allowed is ${MAX_PLACEABLES}`);
        }
        buffer = '';
        content.push(this.getPlaceable());

        this._index++;

        ch = this._source[this._index];
        placeables++;
        continue;
      }

      if (ch) {
        buffer += ch;
      }
      this._index++;
      ch = this._source[this._index];
    }

    if (quoteDelimited) {
      throw this.error('Unclosed string');
    }

    if (content.length === 0) {
      if (quoteDelimited !== null) {
        return buffer.length ? buffer : '';
      }
      return buffer.length ? buffer : undefined;
    }

    if (buffer.length) {
      content.push(buffer);
    }

    return content;
  }
  /* eslint-enable complexity */

  getPlaceable() {
    this._index++;

    this.getWS();

    const start = this._index;
    try {
      return this.getPlaceableExpression();
    } catch (e) {
      throw this.error(e.description, start);
    }
  }

  getPlaceableExpression() {

    if (this._source[this._index] === '*' ||
       (this._source[this._index] === '[' &&
        this._source[this._index + 1] !== ']')) {
      const variants = this.getVariants();

      return {
        type: 'sel',
        exp: null,
        vars: variants[0],
        def: variants[1]
      };
    }

    const selector = this.getSelectorExpression();
    let variants;

    this.getWS();

    const ch = this._source[this._index];

    // If the expression is followed by `->` we're going to collect
    // its members and return it as a select expression.
    if (ch !== '}') {
      if (ch !== '-' || this._source[this._index + 1] !== '>') {
        throw this.error('Expected "}", "," or "->"');
      }
      this._index += 2; // ->

      this.getLineWS();

      if (this._source[this._index] !== '\n') {
        throw this.error('Variants should be listed in a new line');
      }

      this.getWS();

      variants = this.getVariants();

      if (variants[0].length === 0) {
        throw this.error('Expected members for the select expression');
      }
    }

    if (variants === undefined) {
      return selector;
    }
    return {
      type: 'sel',
      exp: selector,
      vars: variants[0],
      def: variants[1]
    };
  }

  getSelectorExpression() {
    const literal = this.getLiteral();

    if (literal.type !== 'ref') {
      return literal;
    }

    if (this._source[this._index] === '.') {
      this._index++;

      const name = this.getIdentifier();
      this._index++;
      return {
        type: 'attr',
        id: literal,
        name
      };
    }

    if (this._source[this._index] === '[') {
      this._index++;

      const key = this.getVariantKey();
      this._index++;
      return {
        type: 'var',
        id: literal,
        key
      };
    }

    if (this._source[this._index] === '(') {
      this._index++;
      const args = this.getCallArgs();

      this._index++;

      literal.type = 'fun';

      return {
        type: 'call',
        fun: literal,
        args
      };
    }

    return literal;
  }

  getCallArgs() {
    const args = [];

    if (this._source[this._index] === ')') {
      return args;
    }

    while (this._index < this._length) {
      this.getLineWS();

      const exp = this.getSelectorExpression();

      // MessageReference in this place may be an entity reference, like:
      // `call(foo)`, or, if it's followed by `:` it will be a key-value pair.
      if (exp.type !== 'ref' ||
         exp.namespace !== undefined) {
        args.push(exp);
      } else {
        this.getLineWS();

        if (this._source[this._index] === ':') {
          this._index++;
          this.getLineWS();

          const val = this.getSelectorExpression();

          // If the expression returned as a value of the argument
          // is not a quote delimited string, number or
          // external argument, throw an error.
          //
          // We don't have to check here if the pattern is quote delimited
          // because that's the only type of string allowed in expressions.
          if (typeof val === 'string' ||
              Array.isArray(val) ||
              val.type === 'num' ||
              val.type === 'ext') {
            args.push({
              type: 'narg',
              name: exp.name,
              val
            });
          } else {
            this._index = this._source.lastIndexOf(':', this._index) + 1;
            throw this.error(
              'Expected string in quotes, number or external argument');
          }

        } else {
          args.push(exp);
        }
      }

      this.getLineWS();

      if (this._source[this._index] === ')') {
        break;
      } else if (this._source[this._index] === ',') {
        this._index++;
      } else {
        throw this.error('Expected "," or ")"');
      }
    }

    return args;
  }

  getNumber() {
    let num = '';
    let cc = this._source.charCodeAt(this._index);

    // The number literal may start with negative sign `-`.
    if (cc === 45) {
      num += '-';
      cc = this._source.charCodeAt(++this._index);
    }

    // next, we expect at least one digit
    if (cc < 48 || cc > 57) {
      throw this.error(`Unknown literal "${num}"`);
    }

    // followed by potentially more digits
    while (cc >= 48 && cc <= 57) {
      num += this._source[this._index++];
      cc = this._source.charCodeAt(this._index);
    }

    // followed by an optional decimal separator `.`
    if (cc === 46) {
      num += this._source[this._index++];
      cc = this._source.charCodeAt(this._index);

      // followed by at least one digit
      if (cc < 48 || cc > 57) {
        throw this.error(`Unknown literal "${num}"`);
      }

      // and optionally more digits
      while (cc >= 48 && cc <= 57) {
        num += this._source[this._index++];
        cc = this._source.charCodeAt(this._index);
      }
    }

    return {
      type: 'num',
      val: num
    };
  }

  getAttributes() {
    const attrs = {};

    while (this._index < this._length) {
      const ch = this._source[this._index];

      if (ch !== '.') {
        break;
      }
      this._index++;

      const key = this.getIdentifier();

      this.getLineWS();

      this._index++;

      this.getLineWS();

      const val = this.getPattern();

      if (typeof val === 'string') {
        attrs[key] = val;
      } else {
        attrs[key] = {
          val
        };
      }

      this.getWS();
    }

    return attrs;
  }

  getVariants() {
    const variants = [];
    let index = 0;
    let defaultIndex;

    while (this._index < this._length) {
      const ch = this._source[this._index];

      if ((ch !== '[' || this._source[this._index + 1] === '[') &&
          ch !== '*') {
        break;
      }
      if (ch === '*') {
        this._index++;
        defaultIndex = index;
      }

      if (this._source[this._index] !== '[') {
        throw this.error('Expected "["');
      }

      this._index++;

      const key = this.getVariantKey();

      this.getLineWS();

      const variant = {
        key,
        val: this.getPattern()
      };
      variants[index++] = variant;

      this.getWS();
    }

    return [variants, defaultIndex];
  }

  // VariantKey may be a Keyword or Number
  getVariantKey() {
    const cc = this._source.charCodeAt(this._index);
    let literal;

    if ((cc >= 48 && cc <= 57) || cc === 45) {
      literal = this.getNumber();
    } else {
      literal = this.getKeyword();
    }

    if (this._source[this._index] !== ']') {
      throw this.error('Expected "]"');
    }

    this._index++;
    return literal;
  }

  getLiteral() {
    const cc = this._source.charCodeAt(this._index);
    if ((cc >= 48 && cc <= 57) || cc === 45) {
      return this.getNumber();
    } else if (cc === 34) { // "
      return this.getPattern();
    } else if (cc === 36) { // $
      this._index++;
      return {
        type: 'ext',
        name: this.getIdentifier()
      };
    }

    return {
      type: 'ref',
      name: this.getIdentifier()
    };
  }

  // At runtime, we don't care about comments so we just have
  // to parse them properly and skip their content.
  getComment() {
    let eol = this._source.indexOf('\n', this._index);

    while (eol !== -1 && this._source[eol + 1] === '#') {
      this._index = eol + 2;

      eol = this._source.indexOf('\n', this._index);

      if (eol === -1) {
        break;
      }
    }

    if (eol === -1) {
      this._index = this._length;
    } else {
      this._index = eol + 1;
    }
  }

  error(message, start = null) {
    const pos = this._index;

    if (start === null) {
      start = pos;
    }
    start = this._findEntityStart(start);

    const context = this._source.slice(start, pos + 10);

    const msg =
      `\n\n  ${message}\nat pos ${pos}:\n------\n…${context}\n------`;
    const err = new L10nError(msg);

    const row = this._source.slice(0, pos).split('\n').length;
    const col = pos - this._source.lastIndexOf('\n', pos - 1);
    err._pos = {start: pos, end: undefined, col: col, row: row};
    err.offset = pos - start;
    err.description = message;
    err.context = context;
    return err;
  }

  getJunkEntry() {
    const pos = this._index;

    let nextEntity = this._findNextEntryStart(pos);

    if (nextEntity === -1) {
      nextEntity = this._length;
    }

    this._index = nextEntity;

    let entityStart = this._findEntityStart(pos);

    if (entityStart < this._lastGoodEntryEnd) {
      entityStart = this._lastGoodEntryEnd;
    }
  }

  _findEntityStart(pos) {
    let start = pos;

    while (true) {
      start = this._source.lastIndexOf('\n', start - 2);
      if (start === -1 || start === 0) {
        start = 0;
        break;
      }
      const cc = this._source.charCodeAt(start + 1);

      if ((cc >= 97 && cc <= 122) || // a-z
          (cc >= 65 && cc <= 90) ||  // A-Z
           cc === 95) {              // _
        start++;
        break;
      }
    }

    return start;
  }

  _findNextEntryStart(pos) {
    let start = pos;

    while (true) {
      if (start === 0 ||
          this._source[start - 1] === '\n') {
        const cc = this._source.charCodeAt(start);

        if ((cc >= 97 && cc <= 122) || // a-z
            (cc >= 65 && cc <= 90) ||  // A-Z
             cc === 95 || cc === 35 || cc === 91) {  // _#[
          break;
        }
      }

      start = this._source.indexOf('\n', start);

      if (start === -1) {
        break;
      }
      start++;
    }

    return start;
  }
}

function parse(string) {
  const parser = new EntriesParser();
  return parser.getResource(string);
}

/**
 * Message contexts are single-language stores of translations.  They are
 * responsible for parsing translation resources in the FTL syntax and can
 * format translation units (entities) to strings.
 *
 * Always use `MessageContext.format` to retrieve translation units from
 * a context.  Translations can contain references to other entities or
 * external arguments, conditional logic in form of select expressions, traits
 * which describe their grammatical features, and can use FTL builtins which
 * make use of the `Intl` formatters to format numbers, dates, lists and more
 * into the context's language.  See the documentation of the FTL syntax for
 * more information.
 */
class MessageContext {

  /**
   * Create an instance of `MessageContext`.
   *
   * The `lang` argument is used to instantiate `Intl` formatters used by
   * translations.  The `options` object can be used to configure the context.
   *
   * Examples:
   *
   *     const ctx = new MessageContext(lang);
   *
   *     const ctx = new MessageContext(lang, { useIsolating: false });
   *
   *     const ctx = new MessageContext(lang, {
   *       useIsolating: true,
   *       functions: {
   *         NODE_ENV: () => process.env.NODE_ENV
   *       }
   *     });
   *
   * Available options:
   *
   *   - `functions` - an object of additional functions available to
   *                   translations as builtins.
   *
   *   - `useIsolating` - boolean specifying whether to use Unicode isolation
   *                    marks (FSI, PDI) for bidi interpolations.
   *
   * @param   {string} lang      - Language of the context.
   * @param   {Object} [options]
   * @returns {MessageContext}
   */
  constructor(lang, { functions = {}, useIsolating = true } = {}) {
    this.lang = lang;
    this.functions = functions;
    this.useIsolating = useIsolating;
    this.messages = new Map();
    this.intls = new WeakMap();
  }

  /**
   * Add a translation resource to the context.
   *
   * The translation resource must use the FTL syntax.  It will be parsed by
   * the context and each translation unit (message) will be available in the
   * `messages` map by its identifier.
   *
   *     ctx.addMessages('foo = Foo');
   *     ctx.messages.get('foo');
   *
   *     // Returns a raw representation of the 'foo' message.
   *
   * Parsed entities should be formatted with the `format` method in case they
   * contain logic (references, select expressions etc.).
   *
   * @param   {string} source - Text resource with translations.
   * @returns {Array<Error>}
   */
  addMessages(source) {
    const [entries, errors] = parse(source);
    for (const id in entries) {
      this.messages.set(id, entries[id]);
    }

    return errors;
  }

  /**
   * Format a message to a string or null.
   *
   * Format a raw `message` from the context's `messages` map into a string (or
   * a null if it has a null value).  `args` will be used to resolve references
   * to external arguments inside of the translation.
   *
   * In case of errors `format` will try to salvage as much of the translation
   * as possible and will still return a string.  For performance reasons, the
   * encountered errors are not returned but instead are appended to the
   * `errors` array passed as the third argument.
   *
   *     const errors = [];
   *     ctx.addMessages('hello = Hello, { $name }!');
   *     const hello = ctx.messages.get('hello');
   *     ctx.format(hello, { name: 'Jane' }, errors);
   *
   *     // Returns 'Hello, Jane!' and `errors` is empty.
   *
   *     ctx.format(hello, undefined, errors);
   *
   *     // Returns 'Hello, name!' and `errors` is now:
   *
   *     [<ReferenceError: Unknown external: name>]
   *
   * @param   {Object | string}    message
   * @param   {Object | undefined} args
   * @param   {Array}              errors
   * @returns {?string}
   */
  format(message, args, errors) {
    // optimize entities which are simple strings with no attributes
    if (typeof message === 'string') {
      return message;
    }

    // optimize simple-string entities with attributes
    if (typeof message.val === 'string') {
      return message.val;
    }

    // optimize entities with null values
    if (message.val === undefined) {
      return null;
    }

    const result = resolve(this, args, message, errors);
    return result instanceof FTLNone ? null : result;
  }

  _memoizeIntlObject(ctor, opts) {
    const cache = this.intls.get(ctor) || {};
    const id = JSON.stringify(opts);

    if (!cache[id]) {
      cache[id] = new ctor(this.lang, opts);
      this.intls.set(ctor, cache);
    }

    return cache[id];
  }
}

Intl.MessageContext = MessageContext;
Intl.MessageNumberArgument = FTLNumber;
Intl.MessageDateTimeArgument = FTLDateTime;

if (!Intl.NumberFormat) {
  Intl.NumberFormat = function() {
    return {
      format(n) {
        return n;
      }
    };
  };
}

if (!Intl.PluralRules) {
  Intl.PluralRules = function(code) {
    const fn = getPluralRule(code);
    return {
      select(n) {
        return fn(n);
      }
    };
  };
}

class Node {
  constructor() {}
}

class Resource extends Node {
  constructor(body = [], comment = null) {
    super(body, comment);
    this.type = 'Resource';
    this.body = body;
    this.comment = comment;
  }
}

class Entry extends Node {
  constructor() {
    super();
    this.type = 'Entry';
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

class Pattern$1 extends Node {
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

class MessageReference$1 extends Expression {
  constructor(id) {
    super();
    this.type = 'MessageReference';
    this.id = id;
  }
}

class ExternalArgument$1 extends Expression {
  constructor(id) {
    super();
    this.type = 'ExternalArgument';
    this.id = id;
  }
}

class SelectExpression$1 extends Expression {
  constructor(expression, variants) {
    super();
    this.type = 'SelectExpression';
    this.expression = expression;
    this.variants = variants;
  }
}

class AttributeExpression$1 extends Expression {
  constructor(id, name) {
    super();
    this.type = 'AttributeExpression';
    this.id = id;
    this.name = name;
  }
}

class VariantExpression$1 extends Expression {
  constructor(id, key) {
    super();
    this.type = 'VariantExpression';
    this.id = id;
    this.key = key;
  }
}

class CallExpression$1 extends Expression {
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

class JunkEntry extends Entry {
  constructor(content) {
    super();
    this.type = 'JunkEntry';
    this.content = content;
  }
}


var ast = Object.freeze({
	Resource: Resource,
	Entry: Entry,
	Message: Message,
	Pattern: Pattern$1,
	Expression: Expression,
	StringExpression: StringExpression,
	NumberExpression: NumberExpression,
	MessageReference: MessageReference$1,
	ExternalArgument: ExternalArgument$1,
	SelectExpression: SelectExpression$1,
	AttributeExpression: AttributeExpression$1,
	VariantExpression: VariantExpression$1,
	CallExpression: CallExpression$1,
	Attribute: Attribute,
	Variant: Variant,
	NamedArgument: NamedArgument,
	Identifier: Identifier,
	Keyword: Keyword,
	Comment: Comment,
	Section: Section,
	Function: Function,
	JunkEntry: JunkEntry
});

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

  getLineNumber() {
    return this.string.slice(1, this.index).split('\n').length;
  }

  getColumnNumber() {
    return this.index - this.string.lastIndexOf('\n', this.index - 1);
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

function error(ps, message) {
  const err = new SyntaxError(message);
  err.lineNumber = ps.getLineNumber();
  err.columnNumber = ps.getColumnNumber();
  return err;
}

function getErrorSlice(source, start, end) {
  const len = source.length;

  let startPos;
  let sliceLen = end - start;

  if (len < sliceLen) {
    startPos = 0;
    sliceLen = len;
  } else if (start + sliceLen >= len) {
    startPos = len - sliceLen - 1;
  } else {
    startPos = start;
  }

  return startPos > 0 ?
    source.substr(startPos - 1, sliceLen) :
    source.substr(0, sliceLen);
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

function parse$1(source) {
  const errors = [];
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
        entries.push(entry);
      }
    } catch (e) {
      entries.push(getJunkEntry(ps, source, entryStartPos));
      errors.push(e);
    }

    ps.skipWSLines();
  }

  return [new Resource(entries, comment), errors];
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

  return new Pattern$1(elements, false);
}

function getExpression(ps) {
  if (ps.isPeekNextLineVariantStart()) {
    const variants = getVariants(ps);

    ps.expectChar('\n');

    return new SelectExpression$1(null, variants);
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

      return new SelectExpression$1(selector, variants);
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
    return new AttributeExpression$1(literal.id, attr);
  }

  if (ch === '[') {
    ps.next();

    const key = getVariantKey(ps);

    ps.expectChar(']');

    return new VariantExpression$1(literal.id, key);
  }

  if (ch === '(') {
    ps.next();

    const args = getCallArgs(ps);

    ps.expectChar(')');

    return new CallExpression$1(literal.id, args);
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
    return new ExternalArgument$1(name);
  }

  const name = getIdentifier(ps);
  return new MessageReference$1(name);

}

function getJunkEntry(ps, source, entryStart) {
  ps.skipToNextEntryStart();

  const slice = getErrorSlice(source, entryStart, ps.getIndex());

  return new JunkEntry(slice);
}


var parser = Object.freeze({
	parse: parse$1
});

const syntax = {
  ast, parser
};

const debug = {
  _parse: parse
};

exports.syntax = syntax;
exports.debug = debug;
exports.L10nError = L10nError;
exports.MessageContext = MessageContext;
exports.MessageNumberArgument = FTLNumber;
exports.MessageDateTimeArgument = FTLDateTime;

Object.defineProperty(exports, '__esModule', { value: true });

})));
