import moment from "moment";
import R from "ramda";
import { getFireDB } from "./fireConnection";
import { fireRef } from "../lib/firedog";

const contactsRef = fireRef(getFireDB().ref("contacts/"));

export const getContactsRef = () => getFireDB().ref("contacts/");
export const contactsList = () =>
  contactsRef.arrayStream().map(arr =>
    arr.map(ct => ({
      ...ct,
      tagKeys: !R.is(Object, ct.tagKeys) ? {} : ct.tagKeys
    }))
  );
export const updateContact = contact => {
  const now = moment();
  return contactsRef.updateById(contact._id, {
    ...contact,
    lastUpdateTime: now.valueOf(),
    lastUpdateTimeStr: now.format()
  });
};

export const updateContactProperty = (contact, propertyName, value) => {
  const now = moment();
  return contactsRef.updateById(contact._id, {
    [propertyName]: value
  });
};

export const updateContactVariantVendors = (contactId, variantKey, values) =>
  getFireDB()
    .ref(`contacts/${contactId}/variantTagKeySet/${variantKey}`)
    .set(values);

export const updateContactById = (id, contact) => {
  const now = moment();
  return contactsRef.updateById(id, {
    ...contact,
    lastUpdateTime: now.valueOf(),
    lastUpdateTimeStr: now.format()
  });
};

export const createContact = contact => {
  const now = moment();
  return contactsRef.push({
    ...contact,
    createTime: now.valueOf(),
    createdTimeStr: now.format()
  });
};
export const deleteContactById = id => contactsRef.removeById(id);
