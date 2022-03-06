"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ParameterDefinition = exports.Definition = void 0;

var _variable = _interopRequireDefault(require("./variable.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @class Definition
 */
var Definition = /*#__PURE__*/_createClass(function Definition(type, name, node, parent, index, kind) {
  _classCallCheck(this, Definition);

  /**
   * @member {String} Definition#type - type of the occurrence (e.g. "Parameter", "Variable", ...).
   */
  this.type = type;
  /**
   * @member {esprima.Identifier} Definition#name - the identifier AST node of the occurrence.
   */

  this.name = name;
  /**
   * @member {esprima.Node} Definition#node - the enclosing node of the identifier.
   */

  this.node = node;
  /**
   * @member {esprima.Node?} Definition#parent - the enclosing statement node of the identifier.
   */

  this.parent = parent;
  /**
   * @member {Number?} Definition#index - the index in the declaration statement.
   */

  this.index = index;
  /**
   * @member {String?} Definition#kind - the kind of the declaration statement.
   */

  this.kind = kind;
});
/**
 * @class ParameterDefinition
 */


exports.Definition = exports.default = Definition;

var ParameterDefinition = /*#__PURE__*/function (_Definition) {
  _inherits(ParameterDefinition, _Definition);

  var _super = _createSuper(ParameterDefinition);

  function ParameterDefinition(name, node, index, rest) {
    var _this;

    _classCallCheck(this, ParameterDefinition);

    _this = _super.call(this, _variable.default.Parameter, name, node, null, index, null);
    /**
     * Whether the parameter definition is a part of a rest parameter.
     * @member {boolean} ParameterDefinition#rest
     */

    _this.rest = rest;
    return _this;
  }

  return _createClass(ParameterDefinition);
}(Definition);
/* vim: set sw=4 ts=4 et tw=80 : */


exports.ParameterDefinition = ParameterDefinition;
//# sourceMappingURL=definition.js.map