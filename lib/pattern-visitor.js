"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _estraverse = require("estraverse");

var _esrecurse = _interopRequireDefault(require("esrecurse"));

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

function getLast(xs) {
  return xs[xs.length - 1] || null;
}

var PatternVisitor = /*#__PURE__*/function (_esrecurse$Visitor) {
  _inherits(PatternVisitor, _esrecurse$Visitor);

  var _super = _createSuper(PatternVisitor);

  function PatternVisitor(options, rootPattern, callback) {
    var _this;

    _classCallCheck(this, PatternVisitor);

    _this = _super.call(this, null, options);
    _this.rootPattern = rootPattern;
    _this.callback = callback;
    _this.assignments = [];
    _this.rightHandNodes = [];
    _this.restElements = [];
    return _this;
  }

  _createClass(PatternVisitor, [{
    key: "Identifier",
    value: function Identifier(pattern) {
      var lastRestElement = getLast(this.restElements);
      this.callback(pattern, {
        topLevel: pattern === this.rootPattern,
        rest: lastRestElement != null && lastRestElement.argument === pattern,
        assignments: this.assignments
      });
    }
  }, {
    key: "Property",
    value: function Property(property) {
      // Computed property's key is a right hand node.
      if (property.computed) {
        this.rightHandNodes.push(property.key);
      } // If it's shorthand, its key is same as its value.
      // If it's shorthand and has its default value, its key is same as its value.left (the value is AssignmentPattern).
      // If it's not shorthand, the name of new variable is its value's.


      this.visit(property.value);
    }
  }, {
    key: "ArrayPattern",
    value: function ArrayPattern(pattern) {
      var _iterator = _createForOfIteratorHelper(pattern.elements),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var element = _step.value;
          this.visit(element);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "AssignmentPattern",
    value: function AssignmentPattern(pattern) {
      this.assignments.push(pattern);
      this.visit(pattern.left);
      this.rightHandNodes.push(pattern.right);
      this.assignments.pop();
    }
  }, {
    key: "RestElement",
    value: function RestElement(pattern) {
      this.restElements.push(pattern);
      this.visit(pattern.argument);
      this.restElements.pop();
    }
  }, {
    key: "MemberExpression",
    value: function MemberExpression(node) {
      // Computed property's key is a right hand node.
      if (node.computed) {
        this.rightHandNodes.push(node.property);
      } // the object is only read, write to its property.


      this.rightHandNodes.push(node.object);
    } //
    // ForInStatement.left and AssignmentExpression.left are LeftHandSideExpression.
    // By spec, LeftHandSideExpression is Pattern or MemberExpression.
    //   (see also: https://github.com/estree/estree/pull/20#issuecomment-74584758)
    // But espree 2.0 and esprima 2.0 parse to ArrayExpression, ObjectExpression, etc...
    //

  }, {
    key: "SpreadElement",
    value: function SpreadElement(node) {
      this.visit(node.argument);
    }
  }, {
    key: "ArrayExpression",
    value: function ArrayExpression(node) {
      node.elements.forEach(this.visit, this);
    }
  }, {
    key: "AssignmentExpression",
    value: function AssignmentExpression(node) {
      this.assignments.push(node);
      this.visit(node.left);
      this.rightHandNodes.push(node.right);
      this.assignments.pop();
    }
  }, {
    key: "CallExpression",
    value: function CallExpression(node) {
      var _this2 = this;

      // arguments are right hand nodes.
      node.arguments.forEach(function (a) {
        _this2.rightHandNodes.push(a);
      });
      this.visit(node.callee);
    }
  }], [{
    key: "isPattern",
    value: function isPattern(node) {
      var nodeType = node.type;
      return nodeType === _estraverse.Syntax.Identifier || nodeType === _estraverse.Syntax.ObjectPattern || nodeType === _estraverse.Syntax.ArrayPattern || nodeType === _estraverse.Syntax.SpreadElement || nodeType === _estraverse.Syntax.RestElement || nodeType === _estraverse.Syntax.AssignmentPattern;
    }
  }]);

  return PatternVisitor;
}(_esrecurse.default.Visitor);
/* vim: set sw=4 ts=4 et tw=80 : */


exports.default = PatternVisitor;
//# sourceMappingURL=pattern-visitor.js.map