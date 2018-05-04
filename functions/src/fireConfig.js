'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var functions = require('firebase-functions');
var admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.functions = functions;
exports.admin = admin;