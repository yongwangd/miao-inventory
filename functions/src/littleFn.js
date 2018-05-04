'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.objectDifference = exports.objectIntersection = exports.toggleArrayItem = exports.propContains = exports.valueContains = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends3 = require('babel-runtime/helpers/extends');

var _extends4 = _interopRequireDefault(_extends3);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _values = require('babel-runtime/core-js/object/values');

var _values2 = _interopRequireDefault(_values);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var valueContains = exports.valueContains = function valueContains(str, ob) {
	var ignoreCase = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	if (!str) return true;
	return (0, _values2.default)(ob).filter(function (v) {
		return v != null;
	}).filter(_ramda2.default.complement(_ramda2.default.is(Function))).some(function (v) {
		return _ramda2.default.is(Object, v) ? valueContains(str, v) : String(ignoreCase ? v.toLowerCase() : v).includes(ignoreCase ? str.toLowerCase() : str);
	});
};

var propContains = exports.propContains = _ramda2.default.curry(function (str, props, ob) {
	return valueContains(str, _ramda2.default.pick(props, ob));
});

var toggleArrayItem = exports.toggleArrayItem = function toggleArrayItem(arr, item) {
	var predicate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _ramda2.default.equals;

	if (item == undefined) return arr;
	return arr.find(predicate(item)) ? arr.filter(function (it) {
		return !predicate(item, it);
	}) : [].concat((0, _toConsumableArray3.default)(arr), [item]);
};

var objectIntersection = exports.objectIntersection = function objectIntersection() {
	var first = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var second = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var eqFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _ramda2.default.equals;
	return _ramda2.default.intersection(_ramda2.default.keys(first), _ramda2.default.keys(second)).filter(function (key) {
		return eqFn(first[key], second[key]);
	}).reduce(function (acc, cur) {
		return (0, _extends4.default)({}, acc, (0, _defineProperty3.default)({}, cur, first[cur]));
	}, {});
};

var objectDifference = exports.objectDifference = function objectDifference() {
	var first = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var second = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var eqFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _ramda2.default.equals;

	var firstKeys = _ramda2.default.keys(first);
	var secondKeys = _ramda2.default.keys(second);
	var sameField = _ramda2.default.intersection(firstKeys, secondKeys).filter(function (key) {
		return eqFn(first[key], second[key]);
	});

	return [_ramda2.default.pick(_ramda2.default.difference(firstKeys, sameField))(first), _ramda2.default.pick(_ramda2.default.difference(secondKeys, sameField))(second)];
};