"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assert = _interopRequireDefault(require("assert"));

var _scope2 = require("./scope");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/**
 * @class ScopeManager
 */
var ScopeManager = /*#__PURE__*/function () {
  function ScopeManager(options) {
    _classCallCheck(this, ScopeManager);

    this.scopes = [];
    this.globalScope = null;
    this.__nodeToScope = new WeakMap();
    this.__currentScope = null;
    this.__options = options;
    this.__declaredVariables = new WeakMap();
  }

  _createClass(ScopeManager, [{
    key: "__useDirective",
    value: function __useDirective() {
      return this.__options.directive;
    }
  }, {
    key: "__isOptimistic",
    value: function __isOptimistic() {
      return this.__options.optimistic;
    }
  }, {
    key: "__ignoreEval",
    value: function __ignoreEval() {
      return this.__options.ignoreEval;
    }
  }, {
    key: "__isNodejsScope",
    value: function __isNodejsScope() {
      return this.__options.nodejsScope;
    }
  }, {
    key: "isModule",
    value: function isModule() {
      return this.__options.sourceType === 'module';
    }
  }, {
    key: "isImpliedStrict",
    value: function isImpliedStrict() {
      return this.__options.impliedStrict;
    }
  }, {
    key: "isStrictModeSupported",
    value: function isStrictModeSupported() {
      return this.__options.ecmaVersion >= 5;
    } // Returns appropriate scope for this node.

  }, {
    key: "__get",
    value: function __get(node) {
      return this.__nodeToScope.get(node);
    }
    /**
     * Get variables that are declared by the node.
     *
     * "are declared by the node" means the node is same as `Variable.defs[].node` or `Variable.defs[].parent`.
     * If the node declares nothing, this method returns an empty array.
     * CAUTION: This API is experimental. See https://github.com/estools/escope/pull/69 for more details.
     *
     * @param {Esprima.Node} node - a node to get.
     * @returns {Variable[]} variables that declared by the node.
     */

  }, {
    key: "getDeclaredVariables",
    value: function getDeclaredVariables(node) {
      return this.__declaredVariables.get(node) || [];
    }
    /**
     * acquire scope from node.
     * @method ScopeManager#acquire
     * @param {Esprima.Node} node - node for the acquired scope.
     * @param {boolean=} inner - look up the most inner scope, default value is false.
     * @return {Scope?}
     */

  }, {
    key: "acquire",
    value: function acquire(node, inner) {
      function predicate(scope) {
        if (scope.type === 'function' && scope.functionExpressionScope) {
          return false;
        }

        if (scope.type === 'TDZ') {
          return false;
        }

        return true;
      }

      var scopes = this.__get(node);

      if (!scopes || scopes.length === 0) {
        return null;
      } // Heuristic selection from all scopes.
      // If you would like to get all scopes, please use ScopeManager#acquireAll.


      if (scopes.length === 1) {
        return scopes[0];
      }

      if (inner) {
        for (var i = scopes.length - 1; i >= 0; --i) {
          var scope = scopes[i];

          if (predicate(scope)) {
            return scope;
          }
        }
      } else {
        var _iterator = _createForOfIteratorHelper(scopes),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _scope = _step.value;

            if (predicate(_scope)) {
              return _scope;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      return null;
    }
    /**
     * acquire all scopes from node.
     * @method ScopeManager#acquireAll
     * @param {Esprima.Node} node - node for the acquired scope.
     * @return {Scope[]?}
     */

  }, {
    key: "acquireAll",
    value: function acquireAll(node) {
      return this.__get(node);
    }
    /**
     * release the node.
     * @method ScopeManager#release
     * @param {Esprima.Node} node - releasing node.
     * @param {boolean=} inner - look up the most inner scope, default value is false.
     * @return {Scope?} upper scope for the node.
     */

  }, {
    key: "release",
    value: function release(node, inner) {
      var scopes = this.__get(node);

      if (scopes && scopes.length) {
        var scope = scopes[0].upper;

        if (!scope) {
          return null;
        }

        return this.acquire(scope.block, inner);
      }

      return null;
    }
  }, {
    key: "attach",
    value: function attach() {}
  }, {
    key: "detach",
    value: function detach() {}
  }, {
    key: "__nestScope",
    value: function __nestScope(scope) {
      if (scope instanceof _scope2.GlobalScope) {
        (0, _assert.default)(this.__currentScope === null);
        this.globalScope = scope;
      }

      this.__currentScope = scope;
      return scope;
    }
  }, {
    key: "__nestGlobalScope",
    value: function __nestGlobalScope(node) {
      return this.__nestScope(new _scope2.GlobalScope(this, node));
    }
  }, {
    key: "__nestBlockScope",
    value: function __nestBlockScope(node
    /* , isMethodDefinition */
    ) {
      return this.__nestScope(new _scope2.BlockScope(this, this.__currentScope, node));
    }
  }, {
    key: "__nestFunctionScope",
    value: function __nestFunctionScope(node, isMethodDefinition) {
      return this.__nestScope(new _scope2.FunctionScope(this, this.__currentScope, node, isMethodDefinition));
    }
  }, {
    key: "__nestForScope",
    value: function __nestForScope(node) {
      return this.__nestScope(new _scope2.ForScope(this, this.__currentScope, node));
    }
  }, {
    key: "__nestCatchScope",
    value: function __nestCatchScope(node) {
      return this.__nestScope(new _scope2.CatchScope(this, this.__currentScope, node));
    }
  }, {
    key: "__nestWithScope",
    value: function __nestWithScope(node) {
      return this.__nestScope(new _scope2.WithScope(this, this.__currentScope, node));
    }
  }, {
    key: "__nestClassScope",
    value: function __nestClassScope(node) {
      return this.__nestScope(new _scope2.ClassScope(this, this.__currentScope, node));
    }
  }, {
    key: "__nestSwitchScope",
    value: function __nestSwitchScope(node) {
      return this.__nestScope(new _scope2.SwitchScope(this, this.__currentScope, node));
    }
  }, {
    key: "__nestModuleScope",
    value: function __nestModuleScope(node) {
      return this.__nestScope(new _scope2.ModuleScope(this, this.__currentScope, node));
    }
  }, {
    key: "__nestTDZScope",
    value: function __nestTDZScope(node) {
      return this.__nestScope(new _scope2.TDZScope(this, this.__currentScope, node));
    }
  }, {
    key: "__nestFunctionExpressionNameScope",
    value: function __nestFunctionExpressionNameScope(node) {
      return this.__nestScope(new _scope2.FunctionExpressionNameScope(this, this.__currentScope, node));
    }
  }, {
    key: "__isES6",
    value: function __isES6() {
      return this.__options.ecmaVersion >= 6;
    }
  }]);

  return ScopeManager;
}();
/* vim: set sw=4 ts=4 et tw=80 : */


exports.default = ScopeManager;
//# sourceMappingURL=scope-manager.js.map