"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Reference", {
  enumerable: true,
  get: function get() {
    return _reference.default;
  }
});
Object.defineProperty(exports, "Scope", {
  enumerable: true,
  get: function get() {
    return _scope.default;
  }
});
Object.defineProperty(exports, "ScopeManager", {
  enumerable: true,
  get: function get() {
    return _scopeManager.default;
  }
});
Object.defineProperty(exports, "Variable", {
  enumerable: true,
  get: function get() {
    return _variable.default;
  }
});
exports.analyze = analyze;
Object.defineProperty(exports, "version", {
  enumerable: true,
  get: function get() {
    return _package.version;
  }
});

var _assert = _interopRequireDefault(require("assert"));

var _scopeManager = _interopRequireDefault(require("./scope-manager.js"));

var _referencer = _interopRequireDefault(require("./referencer.js"));

var _reference = _interopRequireDefault(require("./reference.js"));

var _variable = _interopRequireDefault(require("./variable.js"));

var _scope = _interopRequireDefault(require("./scope.js"));

var _package = require("../package.json");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectEntries(obj) {
  var entries = [];
  var keys = Object.keys(obj);

  for (var k = 0; k < keys.length; k++) entries.push([keys[k], obj[keys[k]]]);

  return entries;
}

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function defaultOptions() {
  return {
    optimistic: false,
    directive: false,
    nodejsScope: false,
    impliedStrict: false,
    sourceType: 'script',
    // one of ['script', 'module']
    ecmaVersion: 5,
    childVisitorKeys: null,
    fallback: 'iteration'
  };
}

function updateDeeply(target, override) {
  function isHashObject(target) {
    return typeof target === 'object' && target instanceof Object && !(target instanceof Array) && !(target instanceof RegExp);
  }

  for (var _i = 0, _Object$entries = _objectEntries(override || {}); _i < _Object$entries.length; _i++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        val = _Object$entries$_i[1];

    if (isHashObject(val)) {
      // istanbul ignore if
      if (isHashObject(target[key])) {
        updateDeeply(target[key], val);
      } else {
        target[key] = updateDeeply({}, val);
      }
    } else {
      target[key] = val;
    }
  }

  return target;
}
/**
 * Main interface function. Takes an Esprima syntax tree and returns the
 * analyzed scopes.
 * @function analyze
 * @param {esprima.Tree} tree
 * @param {Object} providedOptions - Options that tailor the scope analysis
 * @param {boolean} [providedOptions.optimistic=false] - the optimistic flag
 * @param {boolean} [providedOptions.directive=false]- the directive flag
 * @param {boolean} [providedOptions.ignoreEval=false]- whether to check 'eval()' calls
 * @param {boolean} [providedOptions.nodejsScope=false]- whether the whole
 * script is executed under node.js environment. When enabled, escope adds
 * a function scope immediately following the global scope.
 * @param {boolean} [providedOptions.impliedStrict=false]- implied strict mode
 * (if ecmaVersion >= 5).
 * @param {string} [providedOptions.sourceType='script']- the source type of the script. one of 'script' and 'module'
 * @param {number} [providedOptions.ecmaVersion=5]- which ECMAScript version is considered
 * @param {Object} [providedOptions.childVisitorKeys=null] - Additional known visitor keys. See [esrecurse](https://github.com/estools/esrecurse)'s the `childVisitorKeys` option.
 * @param {string} [providedOptions.fallback='iteration'] - A kind of the fallback in order to encounter with unknown node. See [esrecurse](https://github.com/estools/esrecurse)'s the `fallback` option.
 * @return {ScopeManager}
 */


function analyze(tree, providedOptions) {
  var options = updateDeeply(defaultOptions(), providedOptions);
  var scopeManager = new _scopeManager.default(options);
  var referencer = new _referencer.default(options, scopeManager);
  referencer.visit(tree);
  (0, _assert.default)(scopeManager.__currentScope === null, 'currentScope should be null.');
  return scopeManager;
}
/* vim: set sw=4 ts=4 et tw=80 : */
//# sourceMappingURL=index.js.map