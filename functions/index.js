'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.tagUpdateLog = exports.tagDeleteLog = exports.tagCreateLog = exports.contactDeleteLog = exports.contactUpdateLog = exports.contactCreateLog = exports.deleteTagFromContacts = exports.cleanContactTags = exports.addMessage = undefined;

require('babel-polyfill');

var _dataChangeLog = require('./src/dataChangeLog');

var _manageTags = require('./src/manageTags');

exports.addMessage = _manageTags.addMessage;
exports.cleanContactTags = _manageTags.cleanContactTags;
exports.deleteTagFromContacts = _manageTags.deleteTagFromContacts;
exports.contactCreateLog = _dataChangeLog.contactCreateLog;
exports.contactUpdateLog = _dataChangeLog.contactUpdateLog;
exports.contactDeleteLog = _dataChangeLog.contactDeleteLog;
exports.tagCreateLog = _dataChangeLog.tagCreateLog;
exports.tagDeleteLog = _dataChangeLog.tagDeleteLog;
exports.tagUpdateLog = _dataChangeLog.tagUpdateLog;