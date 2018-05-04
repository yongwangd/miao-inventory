'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.tagDeleteLog = exports.tagUpdateLog = exports.tagCreateLog = exports.contactDeleteLog = exports.contactUpdateLog = exports.contactCreateLog = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _fireConfig = require('./fireConfig');

var _littleFn = require('./littleFn');

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logDateChange = function logDateChange(params) {
	if (!params.scheme) {
		console.warn('LOG DATE CHANGE FAILED, no scheme or no data');
		return;
	}

	var data = params.data,
	    prev = params.prev,
	    rest = (0, _objectWithoutProperties3.default)(params, ['data', 'prev']);

	var _objectDifference = (0, _littleFn.objectDifference)(data, prev, function (v1, v2) {
		var flat = function flat(v) {
			return v == null || v == {} || v == '' ? null : v;
		};
		return _ramda2.default.equals(flat(v1), flat(v2));
	});

	var _objectDifference2 = (0, _slicedToArray3.default)(_objectDifference, 2);

	data = _objectDifference2[0];
	prev = _objectDifference2[1];


	var now = (0, _moment2.default)();
	return _fireConfig.admin.database().ref('/eventLogs').push((0, _extends3.default)({}, rest, {
		data: data,
		prev: prev,
		time: now.valueOf(),
		timeStr: now.format()
	}));
};

var logWithTable = _ramda2.default.curry(function (scheme, displayNameField, event, type, id) {
	var data = event.data.val();
	var prev = event.data.previous.val();
	var displayName = data[displayNameField] || prev[displayNameField];

	return logDateChange({
		id: id,
		displayName: displayName,
		scheme: scheme,
		type: type,
		data: data,
		prev: prev
	});
});

var contactLog = logWithTable('contacts', 'name');

var contactCreateLog = exports.contactCreateLog = _fireConfig.functions.database.ref('/contacts/{cid}').onCreate(function (event) {
	var id = event.params.cid;
	return contactLog(event, 'CREATE', id);
});

var contactUpdateLog = exports.contactUpdateLog = _fireConfig.functions.database.ref('/contacts/{cid}').onUpdate(function (event) {
	var id = event.params.cid;
	return contactLog(event, 'UPDATE', id);
});

var contactDeleteLog = exports.contactDeleteLog = _fireConfig.functions.database.ref('/contacts/{cid}').onDelete(function (event) {
	var id = event.params.cid;
	return contactLog(event, 'DELETE', id);
});

var tagLog = logWithTable('contactTags', 'label');

var tagCreateLog = exports.tagCreateLog = _fireConfig.functions.database.ref('/contactTags/{cid}').onCreate(function (event) {
	var id = event.params.cid;
	return tagLog(event, 'CREATE', id);
});

var tagUpdateLog = exports.tagUpdateLog = _fireConfig.functions.database.ref('/contactsTags/{cid}').onUpdate(function (event) {
	var id = event.params.cid;
	return tagLog(event, 'UPDATE', id);
});

var tagDeleteLog = exports.tagDeleteLog = _fireConfig.functions.database.ref('/contactTags/{cid}').onDelete(function (event) {
	var id = event.params.cid;
	return tagLog(event, 'DELETE', id);
});