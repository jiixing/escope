"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _estraverse = require("estraverse");

var _esrecurse = _interopRequireDefault(require("esrecurse"));

var _reference = _interopRequireDefault(require("./reference.js"));

var _variable = _interopRequireDefault(require("./variable.js"));

var _patternVisitor = _interopRequireDefault(require("./pattern-visitor.js"));

var _definition = require("./definition.js");

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function traverseIdentifierInPattern(options, rootPattern, referencer, callback) {
  // Call the callback at left hand identifier nodes, and Collect right hand nodes.
  var visitor = new _patternVisitor.default(options, rootPattern, callback);
  visitor.visit(rootPattern); // Process the right hand nodes recursively.

  if (referencer != null) {
    visitor.rightHandNodes.forEach(referencer.visit, referencer);
  }
} // Importing ImportDeclaration.
// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-moduledeclarationinstantiation
// https://github.com/estree/estree/blob/master/es6.md#importdeclaration
// FIXME: Now, we don't create module environment, because the context is
// implementation dependent.


var Importer = /*#__PURE__*/function (_esrecurse$Visitor) {
  _inherits(Importer, _esrecurse$Visitor);

  var _super = _createSuper(Importer);

  function Importer(declaration, referencer) {
    var _this;

    _classCallCheck(this, Importer);

    _this = _super.call(this, null, referencer.options);
    _this.declaration = declaration;
    _this.referencer = referencer;
    return _this;
  }

  _createClass(Importer, [{
    key: "visitImport",
    value: function visitImport(id, specifier) {
      var _this2 = this;

      this.referencer.visitPattern(id, function (pattern) {
        _this2.referencer.currentScope().__define(pattern, new _definition.Definition(_variable.default.ImportBinding, pattern, specifier, _this2.declaration, null, null));
      });
    }
  }, {
    key: "ImportNamespaceSpecifier",
    value: function ImportNamespaceSpecifier(node) {
      var local = node.local || node.id;

      if (local) {
        this.visitImport(local, node);
      }
    }
  }, {
    key: "ImportDefaultSpecifier",
    value: function ImportDefaultSpecifier(node) {
      var local = node.local || node.id;
      this.visitImport(local, node);
    }
  }, {
    key: "ImportSpecifier",
    value: function ImportSpecifier(node) {
      var local = node.local || node.id;

      if (node.name) {
        this.visitImport(node.name, node);
      } else {
        this.visitImport(local, node);
      }
    }
  }]);

  return Importer;
}(_esrecurse.default.Visitor); // Referencing variables and creating bindings.


var Referencer = /*#__PURE__*/function (_esrecurse$Visitor2) {
  _inherits(Referencer, _esrecurse$Visitor2);

  var _super2 = _createSuper(Referencer);

  function Referencer(options, scopeManager) {
    var _this3;

    _classCallCheck(this, Referencer);

    _this3 = _super2.call(this, null, options);
    _this3.options = options;
    _this3.scopeManager = scopeManager;
    _this3.parent = null;
    _this3.isInnerMethodDefinition = false;
    return _this3;
  }

  _createClass(Referencer, [{
    key: "currentScope",
    value: function currentScope() {
      return this.scopeManager.__currentScope;
    }
  }, {
    key: "close",
    value: function close(node) {
      while (this.currentScope() && node === this.currentScope().block) {
        this.scopeManager.__currentScope = this.currentScope().__close(this.scopeManager);
      }
    }
  }, {
    key: "pushInnerMethodDefinition",
    value: function pushInnerMethodDefinition(isInnerMethodDefinition) {
      var previous = this.isInnerMethodDefinition;
      this.isInnerMethodDefinition = isInnerMethodDefinition;
      return previous;
    }
  }, {
    key: "popInnerMethodDefinition",
    value: function popInnerMethodDefinition(isInnerMethodDefinition) {
      this.isInnerMethodDefinition = isInnerMethodDefinition;
    }
  }, {
    key: "materializeTDZScope",
    value: function materializeTDZScope(node, iterationNode) {
      // http://people.mozilla.org/~jorendorff/es6-draft.html#sec-runtime-semantics-forin-div-ofexpressionevaluation-abstract-operation
      // TDZ scope hides the declaration's names.
      this.scopeManager.__nestTDZScope(node, iterationNode);

      this.visitVariableDeclaration(this.currentScope(), _variable.default.TDZ, iterationNode.left, 0, true);
    }
  }, {
    key: "materializeIterationScope",
    value: function materializeIterationScope(node) {
      var _this4 = this;

      // Generate iteration scope for upper ForIn/ForOf Statements.
      this.scopeManager.__nestForScope(node);

      var letOrConstDecl = node.left;
      this.visitVariableDeclaration(this.currentScope(), _variable.default.Variable, letOrConstDecl, 0);
      this.visitPattern(letOrConstDecl.declarations[0].id, function (pattern) {
        _this4.currentScope().__referencing(pattern, _reference.default.WRITE, node.right, null, true, true);
      });
    }
  }, {
    key: "referencingDefaultValue",
    value: function referencingDefaultValue(pattern, assignments, maybeImplicitGlobal, init) {
      var scope = this.currentScope();
      assignments.forEach(function (assignment) {
        scope.__referencing(pattern, _reference.default.WRITE, assignment.right, maybeImplicitGlobal, pattern !== assignment.left, init);
      });
    }
  }, {
    key: "visitPattern",
    value: function visitPattern(node, options, callback) {
      if (typeof options === 'function') {
        callback = options;
        options = {
          processRightHandNodes: false
        };
      }

      traverseIdentifierInPattern(this.options, node, options.processRightHandNodes ? this : null, callback);
    }
  }, {
    key: "visitFunction",
    value: function visitFunction(node) {
      var _this5 = this;

      // FunctionDeclaration name is defined in upper scope
      // NOTE: Not referring variableScope. It is intended.
      // Since
      //  in ES5, FunctionDeclaration should be in FunctionBody.
      //  in ES6, FunctionDeclaration should be block scoped.
      if (node.type === _estraverse.Syntax.FunctionDeclaration) {
        // id is defined in upper scope
        this.currentScope().__define(node.id, new _definition.Definition(_variable.default.FunctionName, node.id, node, null, null, null));
      } // FunctionExpression with name creates its special scope;
      // FunctionExpressionNameScope.


      if (node.type === _estraverse.Syntax.FunctionExpression && node.id) {
        this.scopeManager.__nestFunctionExpressionNameScope(node);
      } // Consider this function is in the MethodDefinition.


      this.scopeManager.__nestFunctionScope(node, this.isInnerMethodDefinition); // Process parameter declarations.


      var _loop = function _loop(i, iz) {
        _this5.visitPattern(node.params[i], {
          processRightHandNodes: true
        }, function (pattern, info) {
          _this5.currentScope().__define(pattern, new _definition.ParameterDefinition(pattern, node, i, info.rest));

          _this5.referencingDefaultValue(pattern, info.assignments, null, true);
        });
      };

      for (var i = 0, iz = node.params.length; i < iz; ++i) {
        _loop(i, iz);
      } // if there's a rest argument, add that


      if (node.rest) {
        this.visitPattern({
          type: 'RestElement',
          argument: node.rest
        }, function (pattern) {
          _this5.currentScope().__define(pattern, new _definition.ParameterDefinition(pattern, node, node.params.length, true));
        });
      } // Skip BlockStatement to prevent creating BlockStatement scope.


      if (node.body.type === _estraverse.Syntax.BlockStatement) {
        this.visitChildren(node.body);
      } else {
        this.visit(node.body);
      }

      this.close(node);
    }
  }, {
    key: "visitClass",
    value: function visitClass(node) {
      if (node.type === _estraverse.Syntax.ClassDeclaration) {
        this.currentScope().__define(node.id, new _definition.Definition(_variable.default.ClassName, node.id, node, null, null, null));
      } // FIXME: Maybe consider TDZ.


      this.visit(node.superClass);

      this.scopeManager.__nestClassScope(node);

      if (node.id) {
        this.currentScope().__define(node.id, new _definition.Definition(_variable.default.ClassName, node.id, node));
      }

      this.visit(node.body);
      this.close(node);
    }
  }, {
    key: "visitProperty",
    value: function visitProperty(node) {
      var previous;

      if (node.computed) {
        this.visit(node.key);
      }

      var isMethodDefinition = node.type === _estraverse.Syntax.MethodDefinition;

      if (isMethodDefinition) {
        previous = this.pushInnerMethodDefinition(true);
      }

      this.visit(node.value);

      if (isMethodDefinition) {
        this.popInnerMethodDefinition(previous);
      }
    }
  }, {
    key: "visitForIn",
    value: function visitForIn(node) {
      var _this6 = this;

      if (node.left.type === _estraverse.Syntax.VariableDeclaration && node.left.kind !== 'var') {
        this.materializeTDZScope(node.right, node);
        this.visit(node.right);
        this.close(node.right);
        this.materializeIterationScope(node);
        this.visit(node.body);
        this.close(node);
      } else {
        if (node.left.type === _estraverse.Syntax.VariableDeclaration) {
          this.visit(node.left);
          this.visitPattern(node.left.declarations[0].id, function (pattern) {
            _this6.currentScope().__referencing(pattern, _reference.default.WRITE, node.right, null, true, true);
          });
        } else {
          this.visitPattern(node.left, {
            processRightHandNodes: true
          }, function (pattern, info) {
            var maybeImplicitGlobal = null;

            if (!_this6.currentScope().isStrict) {
              maybeImplicitGlobal = {
                pattern,
                node
              };
            }

            _this6.referencingDefaultValue(pattern, info.assignments, maybeImplicitGlobal, false);

            _this6.currentScope().__referencing(pattern, _reference.default.WRITE, node.right, maybeImplicitGlobal, true, false);
          });
        }

        this.visit(node.right);
        this.visit(node.body);
      }
    }
  }, {
    key: "visitVariableDeclaration",
    value: function visitVariableDeclaration(variableTargetScope, type, node, index, fromTDZ) {
      var _this7 = this;

      // If this was called to initialize a TDZ scope, this needs to make definitions, but doesn't make references.
      var decl = node.declarations[index];
      var init = decl.init;
      this.visitPattern(decl.id, {
        processRightHandNodes: !fromTDZ
      }, function (pattern, info) {
        variableTargetScope.__define(pattern, new _definition.Definition(type, pattern, decl, node, index, node.kind));

        if (!fromTDZ) {
          _this7.referencingDefaultValue(pattern, info.assignments, null, true);
        }

        if (init) {
          _this7.currentScope().__referencing(pattern, _reference.default.WRITE, init, null, !info.topLevel, true);
        }
      });
    }
  }, {
    key: "AssignmentExpression",
    value: function AssignmentExpression(node) {
      var _this8 = this;

      if (_patternVisitor.default.isPattern(node.left)) {
        if (node.operator === '=') {
          this.visitPattern(node.left, {
            processRightHandNodes: true
          }, function (pattern, info) {
            var maybeImplicitGlobal = null;

            if (!_this8.currentScope().isStrict) {
              maybeImplicitGlobal = {
                pattern,
                node
              };
            }

            _this8.referencingDefaultValue(pattern, info.assignments, maybeImplicitGlobal, false);

            _this8.currentScope().__referencing(pattern, _reference.default.WRITE, node.right, maybeImplicitGlobal, !info.topLevel, false);
          });
        } else {
          this.currentScope().__referencing(node.left, _reference.default.RW, node.right);
        }
      } else {
        this.visit(node.left);
      }

      this.visit(node.right);
    }
  }, {
    key: "CatchClause",
    value: function CatchClause(node) {
      var _this9 = this;

      this.scopeManager.__nestCatchScope(node);

      this.visitPattern(node.param, {
        processRightHandNodes: true
      }, function (pattern, info) {
        _this9.currentScope().__define(pattern, new _definition.Definition(_variable.default.CatchClause, node.param, node, null, null, null));

        _this9.referencingDefaultValue(pattern, info.assignments, null, true);
      });
      this.visit(node.body);
      this.close(node);
    }
  }, {
    key: "Program",
    value: function Program(node) {
      this.scopeManager.__nestGlobalScope(node);

      if (this.scopeManager.__isNodejsScope()) {
        // Force strictness of GlobalScope to false when using node.js scope.
        this.currentScope().isStrict = false;

        this.scopeManager.__nestFunctionScope(node, false);
      }

      if (this.scopeManager.__isES6() && this.scopeManager.isModule()) {
        this.scopeManager.__nestModuleScope(node);
      }

      if (this.scopeManager.isStrictModeSupported() && this.scopeManager.isImpliedStrict()) {
        this.currentScope().isStrict = true;
      }

      this.visitChildren(node);
      this.close(node);
    }
  }, {
    key: "Identifier",
    value: function Identifier(node) {
      this.currentScope().__referencing(node);
    }
  }, {
    key: "UpdateExpression",
    value: function UpdateExpression(node) {
      if (_patternVisitor.default.isPattern(node.argument)) {
        this.currentScope().__referencing(node.argument, _reference.default.RW, null);
      } else {
        this.visitChildren(node);
      }
    }
  }, {
    key: "MemberExpression",
    value: function MemberExpression(node) {
      this.visit(node.object);

      if (node.computed) {
        this.visit(node.property);
      }
    }
  }, {
    key: "Property",
    value: function Property(node) {
      this.visitProperty(node);
    }
  }, {
    key: "MethodDefinition",
    value: function MethodDefinition(node) {
      this.visitProperty(node);
    }
  }, {
    key: "BreakStatement",
    value: function BreakStatement() {}
  }, {
    key: "ContinueStatement",
    value: function ContinueStatement() {}
  }, {
    key: "LabeledStatement",
    value: function LabeledStatement(node) {
      this.visit(node.body);
    }
  }, {
    key: "ForStatement",
    value: function ForStatement(node) {
      // Create ForStatement declaration.
      // NOTE: In ES6, ForStatement dynamically generates
      // per iteration environment. However, escope is
      // a static analyzer, we only generate one scope for ForStatement.
      if (node.init && node.init.type === _estraverse.Syntax.VariableDeclaration && node.init.kind !== 'var') {
        this.scopeManager.__nestForScope(node);
      }

      this.visitChildren(node);
      this.close(node);
    }
  }, {
    key: "ClassExpression",
    value: function ClassExpression(node) {
      this.visitClass(node);
    }
  }, {
    key: "ClassDeclaration",
    value: function ClassDeclaration(node) {
      this.visitClass(node);
    }
  }, {
    key: "CallExpression",
    value: function CallExpression(node) {
      // Check this is direct call to eval
      if (!this.scopeManager.__ignoreEval() && node.callee.type === _estraverse.Syntax.Identifier && node.callee.name === 'eval') {
        // NOTE: This should be `variableScope`. Since direct eval call always creates Lexical environment and
        // let / const should be enclosed into it. Only VariableDeclaration affects on the caller's environment.
        this.currentScope().variableScope.__detectEval();
      }

      this.visitChildren(node);
    }
  }, {
    key: "BlockStatement",
    value: function BlockStatement(node) {
      if (this.scopeManager.__isES6()) {
        this.scopeManager.__nestBlockScope(node);
      }

      this.visitChildren(node);
      this.close(node);
    }
  }, {
    key: "ThisExpression",
    value: function ThisExpression() {
      this.currentScope().variableScope.__detectThis();
    }
  }, {
    key: "WithStatement",
    value: function WithStatement(node) {
      this.visit(node.object); // Then nest scope for WithStatement.

      this.scopeManager.__nestWithScope(node);

      this.visit(node.body);
      this.close(node);
    }
  }, {
    key: "VariableDeclaration",
    value: function VariableDeclaration(node) {
      var variableTargetScope = node.kind === 'var' ? this.currentScope().variableScope : this.currentScope();

      for (var i = 0, iz = node.declarations.length; i < iz; ++i) {
        var decl = node.declarations[i];
        this.visitVariableDeclaration(variableTargetScope, _variable.default.Variable, node, i);

        if (decl.init) {
          this.visit(decl.init);
        }
      }
    } // sec 13.11.8

  }, {
    key: "SwitchStatement",
    value: function SwitchStatement(node) {
      this.visit(node.discriminant);

      if (this.scopeManager.__isES6()) {
        this.scopeManager.__nestSwitchScope(node);
      }

      var _iterator = _createForOfIteratorHelper(node.cases),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var cse = _step.value;
          this.visit(cse);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.close(node);
    }
  }, {
    key: "FunctionDeclaration",
    value: function FunctionDeclaration(node) {
      this.visitFunction(node);
    }
  }, {
    key: "FunctionExpression",
    value: function FunctionExpression(node) {
      this.visitFunction(node);
    }
  }, {
    key: "ForOfStatement",
    value: function ForOfStatement(node) {
      this.visitForIn(node);
    }
  }, {
    key: "ForInStatement",
    value: function ForInStatement(node) {
      this.visitForIn(node);
    }
  }, {
    key: "ArrowFunctionExpression",
    value: function ArrowFunctionExpression(node) {
      this.visitFunction(node);
    }
  }, {
    key: "ImportDeclaration",
    value: function ImportDeclaration(node) {
      (0, _assert.default)(this.scopeManager.__isES6() && this.scopeManager.isModule(), 'ImportDeclaration should appear when the mode is ES6 and in the module context.');
      var importer = new Importer(node, this);
      importer.visit(node);
    }
  }, {
    key: "visitExportDeclaration",
    value: function visitExportDeclaration(node) {
      if (node.source) {
        return;
      }

      if (node.declaration) {
        this.visit(node.declaration);
        return;
      }

      this.visitChildren(node);
    }
  }, {
    key: "ExportDeclaration",
    value: function ExportDeclaration(node) {
      this.visitExportDeclaration(node);
    }
  }, {
    key: "ExportNamedDeclaration",
    value: function ExportNamedDeclaration(node) {
      this.visitExportDeclaration(node);
    }
  }, {
    key: "ExportSpecifier",
    value: function ExportSpecifier(node) {
      var local = node.id || node.local;
      this.visit(local);
    }
  }, {
    key: "MetaProperty",
    value: function MetaProperty() {// do nothing.
    }
  }]);

  return Referencer;
}(_esrecurse.default.Visitor);
/* vim: set sw=4 ts=4 et tw=80 : */


exports.default = Referencer;
//# sourceMappingURL=referencer.js.map