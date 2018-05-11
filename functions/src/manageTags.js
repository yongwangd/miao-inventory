'use strict';

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _fireConfig = require('./fireConfig');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeList = function makeList() {
  var ob = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return (0, _keys2.default)(ob).map(function (_id) {
    var v = ob[_id];
    v._id = _id;
    return v;
  });
};

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = _fireConfig.functions.https.onRequest(function (req, res) {
  // Grab the text parameter.
  var original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  _fireConfig.admin.database().ref('/messages').push({ original: original }).then(function (snapshot) {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref);
  });
});

// exports.contactsChanges = functions.database.ref('/contacts/{pushId}').onWrite(event => {
// 	console.log(event.params.pushId);

// 	console.log(event);
// 	console.log(event.data.val());
// });

exports.deleteTagFromContacts = _fireConfig.functions.database.ref('/contactTags/{deleteId}').onDelete(function (event) {
  var tag = event.data.previous.val();
  console.log('[' + tag.label + '] with key [' + tag.key + '] Was Deleted from contactsTag. Going to delete it from contacts');

  return _fireConfig.admin.database().ref('contacts/').once('value', function (e) {
    console.log(e.val());
    var contacts = e.val();
    var contains = (0, _keys2.default)(contacts).map(function (key) {
      var v = contacts[key];
      v._id = key;
      return v;
    }).filter(function (tg) {
      return (tg.tagKeySet || {})[tag.key];
    });

    console.log('There are [' + contains.length + '] contacts has this tag. There are ' + contains.map(function (c) {
      return c.name;
    }));

    var updates = {};
    contains.forEach(function (ct) {
      return updates[ct._id + '/tagKeySet/' + tag.key] = null;
    });
    console.log('THe update will be performerd is ,', updates);

    return _fireConfig.admin.database().ref('contacts/').update(updates);
  });
});

exports.cleanContactTags = _fireConfig.functions.https.onRequest(function (req, res) {
  _fireConfig.admin.database().ref('contactTags').once('value', function (tagv) {
    var tags = makeList(tagv.val());
    var tagKeys = tags.map(function (tg) {
      return tg.key;
    });

    _fireConfig.admin.database().ref('contacts').once('value', function (ctv) {
      var updates = {};
      var contacts = makeList(ctv.val());

      var msg = 'Deleting TAGS:::';

      contacts.forEach(function (ct) {
        var ts = (0, _keys2.default)(ct.tagKeySet || {}).filter(function (key) {
          return tagKeys.indexOf(key) < 0;
        });

        ts.forEach(function (key) {
          return updates[ct._id + '/tagKeySet/' + key] = null;
        });

        if (ts.length > 0) {
          msg += ts.join(', ') + ' from ' + ct.name + '  ...  ';
        }
      });

      console.log('The clean will be performered is ,', updates);
      console.log('message is ', msg);

      _fireConfig.admin.database().ref('contacts').update(updates);

      res.send({ msg: msg, updates: updates });
    });
  });
});