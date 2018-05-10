import 'babel-polyfill';
import {
  contactCreateLog,
  contactDeleteLog,
  contactUpdateLog,
  tagCreateLog,
  tagDeleteLog,
  tagUpdateLog
} from './src/dataChangeLog';
import {
  addMessage,
  cleanContactTags,
  deleteTagFromContacts
} from './src/manageTags';

export {
  addMessage,
  cleanContactTags,
  deleteTagFromContacts,
  contactCreateLog,
  contactUpdateLog,
  contactDeleteLog,
  tagCreateLog,
  tagDeleteLog,
  tagUpdateLog
};
