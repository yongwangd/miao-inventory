import { combineReducers } from "redux";
import locationReducer from "./location";
import contactsReducer from "./contactsReducer";
import authReducer from "./authReducer";
import envReducer from "./envReducer";
import tagsReducer from "./tagsReducer";

export const makeRootReducer = asyncReducers =>
  combineReducers({
    location: locationReducer,
    contactChunk: contactsReducer,
    tagChunk: tagsReducer,
    auth: authReducer,
    env: envReducer,
    ...asyncReducers
  });

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return;

  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
