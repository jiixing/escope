"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.WithScope = exports.TDZScope = exports.SwitchScope = exports.ModuleScope = exports.GlobalScope = exports.FunctionScope = exports.FunctionExpressionNameScope = exports.ForScope = exports.ClassScope = exports.CatchScope = exports.BlockScope = void 0;

var _estraverse = require("estraverse");

var _reference = _interopRequireDefault(require("./reference.js"));

var _variable = _interopRequireDefault(require("./variable.js"));

var _definition = _interopRequireDefault(require("./definition.js"));

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _get() { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(arguments.length < 3 ? target : receiver); } return desc.value; }; } return _get.apply(this, arguments); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function isStrictScope(scope, block, isMethodDefinition, useDirective) {
  // When upper scope is exists and strict, inner scope is also strict.
  if (scope.upper && scope.upper.isStrict) {
    return true;
  } // ArrowFunctionExpression's scope is always strict scope.


  if (block.type === _estraverse.Syntax.ArrowFunctionExpression) {
    return true;
  }

  if (isMethodDefinition) {
    return true;
  }

  if (scope.type === 'class' || scope.type === 'module') {
    return true;
  }

  if (scope.type === 'block' || scope.type === 'switch') {
    return false;
  }

  var body;

  if (scope.type === 'function') {
    if (block.type === _estraverse.Syntax.Program) {
      body = block;
    } else {
      body = block.body;
    }
  } else if (scope.type === 'global') {
    body = block;
  } else {
    return false;
  } // Search 'use strict' directive.


  if (useDirective) {
    var _iterator = _createForOfIteratorHelper(body.body),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var stmt = _step.value;

        if (stmt.type !== _estraverse.Syntax.DirectiveStatement) {
          break;
        }

        if (stmt.raw === '"use strict"' || stmt.raw === '\'use strict\'') {
          return true;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } else {
    var _iterator2 = _createForOfIteratorHelper(body.body),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var _stmt = _step2.value;

        if (_stmt.type !== _estraverse.Syntax.ExpressionStatement) {
          break;
        }

        var expr = _stmt.expression;

        if (expr.type !== _estraverse.Syntax.Literal || typeof expr.value !== 'string') {
          break;
        }

        if (expr.raw != null) {
          if (expr.raw === '"use strict"' || expr.raw === '\'use strict\'') {
            return true;
          }
        } else {
          if (expr.value === 'use strict') {
            return true;
          }
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }

  return false;
}

function registerScope(scopeManager, scope) {
  scopeManager.scopes.push(scope);

  var scopes = scopeManager.__nodeToScope.get(scope.block);

  if (scopes) {
    scopes.push(scope);
  } else {
    scopeManager.__nodeToScope.set(scope.block, [scope]);
  }
}

function shouldBeStatically(def) {
  return def.type === _variable.default.ClassName || def.type === _variable.default.Variable && def.parent.kind !== 'var';
}
/**
 * @class Scope
 */


var Scope = /*#__PURE__*/function () {
  function Scope(scopeManager, type, upperScope, block, isMethodDefinition) {
    _classCallCheck(this, Scope);

    /**
     * One of 'TDZ', 'module', 'block', 'switch', 'function', 'catch', 'with', 'function', 'class', 'global'.
     * @member {String} Scope#type
     */
    this.type = type;
    /**
     * The scoped {@link Variable}s of this scope, as <code>{ Variable.name
     * : Variable }</code>.
     * @member {Map} Scope#set
     */

    this.set = new Map();
    /**
     * The tainted variables of this scope, as <code>{ Variable.name :
     * boolean }</code>.
     * @member {Map} Scope#taints */

    this.taints = new Map();
    /**
     * Generally, through the lexical scoping of JS you can always know
     * which variable an identifier in the source code refers to. There are
     * a few exceptions to this rule. With 'global' and 'with' scopes you
     * can only decide at runtime which variable a reference refers to.
     * Moreover, if 'eval()' is used in a scope, it might introduce new
     * bindings in this or its parent scopes.
     * All those scopes are considered 'dynamic'.
     * @member {boolean} Scope#dynamic
     */

    this.dynamic = this.type === 'global' || this.type === 'with';
    /**
     * A reference to the scope-defining syntax node.
     * @member {esprima.Node} Scope#block
     */

    this.block = block;
    /**
     * The {@link Reference|references} that are not resolved with this scope.
     * @member {Reference[]} Scope#through
     */

    this.through = [];
    /**
     * The scoped {@link Variable}s of this scope. In the case of a
     * 'function' scope this includes the automatic argument <em>arguments</em> as
     * its first element, as well as all further formal arguments.
     * @member {Variable[]} Scope#variables
     */

    this.variables = [];
    /**
     * Any variable {@link Reference|reference} found in this scope. This
     * includes occurrences of local variables as well as variables from
     * parent scopes (including the global scope). For local variables
     * this also includes defining occurrences (like in a 'var' statement).
     * In a 'function' scope this does not include the occurrences of the
     * formal parameter in the parameter list.
     * @member {Reference[]} Scope#references
     */

    this.references = [];
    /**
     * For 'global' and 'function' scopes, this is a self-reference. For
     * other scope types this is the <em>variableScope</em> value of the
     * parent scope.
     * @member {Scope} Scope#variableScope
     */

    this.variableScope = this.type === 'global' || this.type === 'function' || this.type === 'module' ? this : upperScope.variableScope;
    /**
     * Whether this scope is created by a FunctionExpression.
     * @member {boolean} Scope#functionExpressionScope
     */

    this.functionExpressionScope = false;
    /**
     * Whether this is a scope that contains an 'eval()' invocation.
     * @member {boolean} Scope#directCallToEvalScope
     */

    this.directCallToEvalScope = false;
    /**
     * @member {boolean} Scope#thisFound
     */

    this.thisFound = false;
    this.__left = [];
    /**
     * Reference to the parent {@link Scope|scope}.
     * @member {Scope} Scope#upper
     */

    this.upper = upperScope;
    /**
     * Whether 'use strict' is in effect in this scope.
     * @member {boolean} Scope#isStrict
     */

    this.isStrict = isStrictScope(this, block, isMethodDefinition, scopeManager.__useDirective());
    /**
     * List of nested {@link Scope}s.
     * @member {Scope[]} Scope#childScopes
     */

    this.childScopes = [];

    if (this.upper) {
      this.upper.childScopes.push(this);
    }

    this.__declaredVariables = scopeManager.__declaredVariables;
    registerScope(scopeManager, this);
  }

  _createClass(Scope, [{
    key: "__shouldStaticallyClose",
    value: function __shouldStaticallyClose(scopeManager) {
      return !this.dynamic || scopeManager.__isOptimistic();
    }
  }, {
    key: "__shouldStaticallyCloseForGlobal",
    value: function __shouldStaticallyCloseForGlobal(ref) {
      // On global scope, let/const/class declarations should be resolved statically.
      var name = ref.identifier.name;

      if (!this.set.has(name)) {
        return false;
      }

      var variable = this.set.get(name);
      var defs = variable.defs;
      return defs.length > 0 && defs.every(shouldBeStatically);
    }
  }, {
    key: "__staticCloseRef",
    value: function __staticCloseRef(ref) {
      if (!this.__resolve(ref)) {
        this.__delegateToUpperScope(ref);
      }
    }
  }, {
    key: "__dynamicCloseRef",
    value: function __dynamicCloseRef(ref) {
      // notify all names are through to global
      var current = this;

      do {
        current.through.push(ref);
        current = current.upper;
      } while (current);
    }
  }, {
    key: "__globalCloseRef",
    value: function __globalCloseRef(ref) {
      // let/const/class declarations should be resolved statically.
      // others should be resolved dynamically.
      if (this.__shouldStaticallyCloseForGlobal(ref)) {
        this.__staticCloseRef(ref);
      } else {
        this.__dynamicCloseRef(ref);
      }
    }
  }, {
    key: "__close",
    value: function __close(scopeManager) {
      var closeRef;

      if (this.__shouldStaticallyClose(scopeManager)) {
        closeRef = this.__staticCloseRef;
      } else if (this.type !== 'global') {
        closeRef = this.__dynamicCloseRef;
      } else {
        closeRef = this.__globalCloseRef;
      } // Try Resolving all references in this scope.


      var _iterator3 = _createForOfIteratorHelper(this.__left),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var ref = _step3.value;
          closeRef.call(this, ref);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      this.__left = null;
      return this.upper;
    }
  }, {
    key: "__resolve",
    value: function __resolve(ref) {
      var name = ref.identifier.name;

      if (this.set.has(name)) {
        var variable = this.set.get(name);
        variable.references.push(ref);
        variable.stack = variable.stack && ref.from.variableScope === this.variableScope;

        if (ref.tainted) {
          variable.tainted = true;
          this.taints.set(variable.name, true);
        }

        ref.resolved = variable;
        return true;
      }

      return false;
    }
  }, {
    key: "__delegateToUpperScope",
    value: function __delegateToUpperScope(ref) {
      if (this.upper) {
        this.upper.__left.push(ref);
      }

      this.through.push(ref);
    }
  }, {
    key: "__addDeclaredVariablesOfNode",
    value: function __addDeclaredVariablesOfNode(variable, node) {
      if (node == null) {
        return;
      }

      var variables = this.__declaredVariables.get(node);

      if (variables == null) {
        variables = [];

        this.__declaredVariables.set(node, variables);
      }

      if (variables.indexOf(variable) === -1) {
        variables.push(variable);
      }
    }
  }, {
    key: "__defineGeneric",
    value: function __defineGeneric(name, set, variables, node, def) {
      var variable;
      variable = set.get(name);

      if (!variable) {
        variable = new _variable.default(name, this);
        set.set(name, variable);
        variables.push(variable);
      }

      if (def) {
        variable.defs.push(def);

        if (def.type !== _variable.default.TDZ) {
          this.__addDeclaredVariablesOfNode(variable, def.node);

          this.__addDeclaredVariablesOfNode(variable, def.parent);
        }
      }

      if (node) {
        variable.identifiers.push(node);
      }
    }
  }, {
    key: "__define",
    value: function __define(node, def) {
      if (node && node.type === _estraverse.Syntax.Identifier) {
        this.__defineGeneric(node.name, this.set, this.variables, node, def);
      }
    }
  }, {
    key: "__referencing",
    value: function __referencing(node, assign, writeExpr, maybeImplicitGlobal, partial, init) {
      // because Array element may be null
      if (!node || node.type !== _estraverse.Syntax.Identifier) {
        return;
      } // Specially handle like `this`.


      if (node.name === 'super') {
        return;
      }

      var ref = new _reference.default(node, this, assign || _reference.default.READ, writeExpr, maybeImplicitGlobal, !!partial, !!init);
      this.references.push(ref);

      this.__left.push(ref);
    }
  }, {
    key: "__detectEval",
    value: function __detectEval() {
      var current;
      current = this;
      this.directCallToEvalScope = true;

      do {
        current.dynamic = true;
        current = current.upper;
      } while (current);
    }
  }, {
    key: "__detectThis",
    value: function __detectThis() {
      this.thisFound = true;
    }
  }, {
    key: "__isClosed",
    value: function __isClosed() {
      return this.__left === null;
    }
    /**
     * returns resolved {Reference}
     * @method Scope#resolve
     * @param {Esprima.Identifier} ident - identifier to be resolved.
     * @return {Reference}
     */

  }, {
    key: "resolve",
    value: function resolve(ident) {
      (0, _assert.default)(this.__isClosed(), 'Scope should be closed.');
      (0, _assert.default)(ident.type === _estraverse.Syntax.Identifier, 'Target should be identifier.');

      var _iterator4 = _createForOfIteratorHelper(this.references),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var ref = _step4.value;

          if (ref.identifier === ident) {
            return ref;
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return null;
    }
    /**
     * returns this scope is static
     * @method Scope#isStatic
     * @return {boolean}
     */

  }, {
    key: "isStatic",
    value: function isStatic() {
      return !this.dynamic;
    }
    /**
     * returns this scope has materialized arguments
     * @method Scope#isArgumentsMaterialized
     * @return {boolean}
     */

  }, {
    key: "isArgumentsMaterialized",
    value: function isArgumentsMaterialized() {
      return true;
    }
    /**
     * returns this scope has materialized `this` reference
     * @method Scope#isThisMaterialized
     * @return {boolean}
     */

  }, {
    key: "isThisMaterialized",
    value: function isThisMaterialized() {
      return true;
    }
  }, {
    key: "isUsedName",
    value: function isUsedName(name) {
      if (this.set.has(name)) {
        return true;
      }

      var _iterator5 = _createForOfIteratorHelper(this.through),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var thrgh = _step5.value;

          if (thrgh.identifier.name === name) {
            return true;
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      return false;
    }
  }]);

  return Scope;
}();

exports.default = Scope;

var GlobalScope = /*#__PURE__*/function (_Scope) {
  _inherits(GlobalScope, _Scope);

  var _super = _createSuper(GlobalScope);

  function GlobalScope(scopeManager, block) {
    var _this;

    _classCallCheck(this, GlobalScope);

    _this = _super.call(this, scopeManager, 'global', null, block, false);
    _this.implicit = {
      set: new Map(),
      variables: [],

      /**
      * List of {@link Reference}s that are left to be resolved (i.e. which
      * need to be linked to the variable they refer to).
      * @member {Reference[]} Scope#implicit#left
      */
      left: []
    };
    return _this;
  }

  _createClass(GlobalScope, [{
    key: "__close",
    value: function __close(scopeManager) {
      var implicit = [];

      var _iterator6 = _createForOfIteratorHelper(this.__left),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var ref = _step6.value;

          if (ref.__maybeImplicitGlobal && !this.set.has(ref.identifier.name)) {
            implicit.push(ref.__maybeImplicitGlobal);
          }
        } // create an implicit global variable from assignment expression

      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      for (var _i = 0, _implicit = implicit; _i < _implicit.length; _i++) {
        var info = _implicit[_i];

        this.__defineImplicit(info.pattern, new _definition.default(_variable.default.ImplicitGlobalVariable, info.pattern, info.node, null, null, null));
      }

      this.implicit.left = this.__left;
      return _get(_getPrototypeOf(GlobalScope.prototype), "__close", this).call(this, scopeManager);
    }
  }, {
    key: "__defineImplicit",
    value: function __defineImplicit(node, def) {
      if (node && node.type === _estraverse.Syntax.Identifier) {
        this.__defineGeneric(node.name, this.implicit.set, this.implicit.variables, node, def);
      }
    }
  }]);

  return GlobalScope;
}(Scope);

exports.GlobalScope = GlobalScope;

var ModuleScope = /*#__PURE__*/function (_Scope2) {
  _inherits(ModuleScope, _Scope2);

  var _super2 = _createSuper(ModuleScope);

  function ModuleScope(scopeManager, upperScope, block) {
    _classCallCheck(this, ModuleScope);

    return _super2.call(this, scopeManager, 'module', upperScope, block, false);
  }

  return _createClass(ModuleScope);
}(Scope);

exports.ModuleScope = ModuleScope;

var FunctionExpressionNameScope = /*#__PURE__*/function (_Scope3) {
  _inherits(FunctionExpressionNameScope, _Scope3);

  var _super3 = _createSuper(FunctionExpressionNameScope);

  function FunctionExpressionNameScope(scopeManager, upperScope, block) {
    var _this2;

    _classCallCheck(this, FunctionExpressionNameScope);

    _this2 = _super3.call(this, scopeManager, 'function-expression-name', upperScope, block, false);

    _this2.__define(block.id, new _definition.default(_variable.default.FunctionName, block.id, block, null, null, null));

    _this2.functionExpressionScope = true;
    return _this2;
  }

  return _createClass(FunctionExpressionNameScope);
}(Scope);

exports.FunctionExpressionNameScope = FunctionExpressionNameScope;

var CatchScope = /*#__PURE__*/function (_Scope4) {
  _inherits(CatchScope, _Scope4);

  var _super4 = _createSuper(CatchScope);

  function CatchScope(scopeManager, upperScope, block) {
    _classCallCheck(this, CatchScope);

    return _super4.call(this, scopeManager, 'catch', upperScope, block, false);
  }

  return _createClass(CatchScope);
}(Scope);

exports.CatchScope = CatchScope;

var WithScope = /*#__PURE__*/function (_Scope5) {
  _inherits(WithScope, _Scope5);

  var _super5 = _createSuper(WithScope);

  function WithScope(scopeManager, upperScope, block) {
    _classCallCheck(this, WithScope);

    return _super5.call(this, scopeManager, 'with', upperScope, block, false);
  }

  _createClass(WithScope, [{
    key: "__close",
    value: function __close(scopeManager) {
      if (this.__shouldStaticallyClose(scopeManager)) {
        return _get(_getPrototypeOf(WithScope.prototype), "__close", this).call(this, scopeManager);
      }

      var _iterator7 = _createForOfIteratorHelper(this.__left),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var ref = _step7.value;
          ref.tainted = true;

          this.__delegateToUpperScope(ref);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      this.__left = null;
      return this.upper;
    }
  }]);

  return WithScope;
}(Scope);

exports.WithScope = WithScope;

var TDZScope = /*#__PURE__*/function (_Scope6) {
  _inherits(TDZScope, _Scope6);

  var _super6 = _createSuper(TDZScope);

  function TDZScope(scopeManager, upperScope, block) {
    _classCallCheck(this, TDZScope);

    return _super6.call(this, scopeManager, 'TDZ', upperScope, block, false);
  }

  return _createClass(TDZScope);
}(Scope);

exports.TDZScope = TDZScope;

var BlockScope = /*#__PURE__*/function (_Scope7) {
  _inherits(BlockScope, _Scope7);

  var _super7 = _createSuper(BlockScope);

  function BlockScope(scopeManager, upperScope, block) {
    _classCallCheck(this, BlockScope);

    return _super7.call(this, scopeManager, 'block', upperScope, block, false);
  }

  return _createClass(BlockScope);
}(Scope);

exports.BlockScope = BlockScope;

var SwitchScope = /*#__PURE__*/function (_Scope8) {
  _inherits(SwitchScope, _Scope8);

  var _super8 = _createSuper(SwitchScope);

  function SwitchScope(scopeManager, upperScope, block) {
    _classCallCheck(this, SwitchScope);

    return _super8.call(this, scopeManager, 'switch', upperScope, block, false);
  }

  return _createClass(SwitchScope);
}(Scope);

exports.SwitchScope = SwitchScope;

var FunctionScope = /*#__PURE__*/function (_Scope9) {
  _inherits(FunctionScope, _Scope9);

  var _super9 = _createSuper(FunctionScope);

  function FunctionScope(scopeManager, upperScope, block, isMethodDefinition) {
    var _this3;

    _classCallCheck(this, FunctionScope);

    _this3 = _super9.call(this, scopeManager, 'function', upperScope, block, isMethodDefinition); // section 9.2.13, FunctionDeclarationInstantiation.
    // NOTE Arrow functions never have an arguments objects.

    if (_this3.block.type !== _estraverse.Syntax.ArrowFunctionExpression) {
      _this3.__defineArguments();
    }

    return _this3;
  }

  _createClass(FunctionScope, [{
    key: "isArgumentsMaterialized",
    value: function isArgumentsMaterialized() {
      // TODO(Constellation)
      // We can more aggressive on this condition like this.
      //
      // function t() {
      //     // arguments of t is always hidden.
      //     function arguments() {
      //     }
      // }
      if (this.block.type === _estraverse.Syntax.ArrowFunctionExpression) {
        return false;
      }

      if (!this.isStatic()) {
        return true;
      }

      var variable = this.set.get('arguments');
      (0, _assert.default)(variable, 'Always have arguments variable.');
      return variable.tainted || variable.references.length !== 0;
    }
  }, {
    key: "isThisMaterialized",
    value: function isThisMaterialized() {
      if (!this.isStatic()) {
        return true;
      }

      return this.thisFound;
    }
  }, {
    key: "__defineArguments",
    value: function __defineArguments() {
      this.__defineGeneric('arguments', this.set, this.variables, null, null);

      this.taints.set('arguments', true);
    }
  }]);

  return FunctionScope;
}(Scope);

exports.FunctionScope = FunctionScope;

var ForScope = /*#__PURE__*/function (_Scope10) {
  _inherits(ForScope, _Scope10);

  var _super10 = _createSuper(ForScope);

  function ForScope(scopeManager, upperScope, block) {
    _classCallCheck(this, ForScope);

    return _super10.call(this, scopeManager, 'for', upperScope, block, false);
  }

  return _createClass(ForScope);
}(Scope);

exports.ForScope = ForScope;

var ClassScope = /*#__PURE__*/function (_Scope11) {
  _inherits(ClassScope, _Scope11);

  var _super11 = _createSuper(ClassScope);

  function ClassScope(scopeManager, upperScope, block) {
    _classCallCheck(this, ClassScope);

    return _super11.call(this, scopeManager, 'class', upperScope, block, false);
  }

  return _createClass(ClassScope);
}(Scope);
/* vim: set sw=4 ts=4 et tw=80 : */


exports.ClassScope = ClassScope;
//# sourceMappingURL=scope.js.map