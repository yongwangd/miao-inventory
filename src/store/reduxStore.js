import createStore from "./createStore";
import { contactsList } from "../fireQuery/contactsQuery";
import tagsQuery from "../fireQuery/tagsQuery";
import { getFirebase } from "../fireQuery/fireConnection";
import { actions as authActions } from "./authReducer";
import { actions as contactActions } from "./contactsReducer";
import { actions as tagAction } from "./tagsReducer";
import { actions as variantTagAction } from "./variantTagsReducer";
import { actions as vendorTagAction } from "./vendorTagsReducer";

const store = createStore(window.__INITIAL_STATE__);

const contactListSub = contactsList();
const contactTagListSub = tagsQuery("contact").tagList();
const variantTagListSub = tagsQuery("variant").tagList();
const vendorTagListSub = tagsQuery("vendor").tagList();

// listen to user login info
getFirebase()
  .auth()
  .onAuthStateChanged(user => {
    if (user) {
      console.log("user logged in", user);
      store.dispatch(authActions.userLogin(user));
      contactListSub.subscribe(list => {
        console.log(JSON.stringify(list));
        store.dispatch(contactActions.fetchContacts(list));
      });
      contactTagListSub.subscribe(tags => {
        console.log(JSON.stringify(tags));
        store.dispatch(tagAction.fetchTags(tags));
      });
      variantTagListSub.subscribe(variantTags => {
        console.log(JSON.stringify(variantTags));
        store.dispatch(variantTagAction.fetchTags(variantTags));
      });
      vendorTagListSub.subscribe(vendorTags => {
        console.log(JSON.stringify(vendorTags));
        store.dispatch(vendorTagAction.fetchTags(vendorTags));
      });
    } else {
      console.log("user logged out", user);
      store.dispatch(authActions.userLogout());
    }
  });

getFirebase()
  .database()
  .ref("contacts")
  .on("value", v => console.log(v.val(), "keyssss"));

getFirebase()
  .database()
  .ref("contacts")
  .orderByChild("website")
  .startAt("google.com")
  .on("value", v => console.log(v.val(), "keyssss"));

export default store;
