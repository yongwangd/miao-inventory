import { admin, functions } from "./fireConfig";

const makeList = (ob = {}) =>
  Object.keys(ob).map(_id => {
    const v = ob[_id];
    v._id = _id;
    return v;
  });

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  admin
    .database()
    .ref("/messages")
    .push({ original })
    .then(snapshot => {
      // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
      res.redirect(303, snapshot.ref);
    });
});

// exports.contactsChanges = functions.database.ref('/contacts/{pushId}').onWrite(event => {
// 	console.log(event.params.pushId);

// 	console.log(event);
// 	console.log(event.data.val());
// });

exports.deleteTagFromContacts = functions.database
  .ref("/contactTags/{deleteId}")
  .onDelete(event => {
    const tag = event.data.previous.val();
    console.log(
      `[${tag.label}] with key [${tag.key}] Was Deleted from contactsTag. Going to delete it from contacts`
    );

    return admin
      .database()
      .ref("contacts/")
      .once("value", e => {
        console.log(e.val());
        const contacts = e.val();
        const contains = Object.keys(contacts)
          .map(key => {
            const v = contacts[key];
            v._id = key;
            return v;
          })
          .filter(tg => (tg.tagKeySet || {})[tag.key]);

        console.log(
          `There are [${contains.length}] contacts has this tag. There are ${contains.map(
            c => c.name
          )}`
        );

        const updates = {};
        contains.forEach(
          ct => (updates[`${ct._id}/tagKeySet/${tag.key}`] = null)
        );
        console.log("THe update will be performerd is ,", updates);

        return admin
          .database()
          .ref("contacts/")
          .update(updates);
      });
  });

exports.cleanContactTags = functions.https.onRequest((req, res) => {
  admin
    .database()
    .ref("contactTags")
    .once("value", tagv => {
      const tags = makeList(tagv.val());
      const tagKeys = tags.map(tg => tg.key);

      admin
        .database()
        .ref("contacts")
        .once("value", ctv => {
          const updates = {};
          const contacts = makeList(ctv.val());

          let msg = "Deleting TAGS:::";

          contacts.forEach(ct => {
            const ts = Object.keys(ct.tagKeySet || {}).filter(
              key => tagKeys.indexOf(key) < 0
            );

            ts.forEach(key => (updates[`${ct._id}/tagKeySet/${key}`] = null));

            if (ts.length > 0) {
              msg += `${ts.join(", ")} from ${ct.name}  ...  `;
            }
          });

          console.log("The clean will be performered is ,", updates);
          console.log("message is ", msg);

          admin
            .database()
            .ref("contacts")
            .update(updates);

          res.send({ msg, updates });
        });
    });
});
