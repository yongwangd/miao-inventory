const { getFireDB } = require("./fireConnection");
const { fireRef } = require("../lib/firedog");

const contactTagRef = fireRef(getFireDB().ref("contactTags/"));

export const contactTagList = () => contactTagRef.arrayStream();
export const updateContactTag = contactTag =>
  contactTagRef.updateById(contactTag._id, contactTag);
export const updateContactTagById = (id, contactTag) =>
  contactTagRef.updateById(id, contactTag);
export const createContactTag = contactTag => contactTagRef.push(contactTag);
export const deleteContactTagById = id => contactTagRef.removeById(id);
