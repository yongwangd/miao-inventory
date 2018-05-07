// import TagList from "../routes/Contacts/components/TagList";

const { getFireDB } = require("./fireConnection");
const { fireRef } = require("../lib/firedog");

// const contactTagRef = fireRef(getFireDB().ref("contactTags/"));

// export const contactTagList = () => contactTagRef.arrayStream();
// export const updateContactTag = contactTag =>
//   contactTagRef.updateById(contactTag._id, contactTag);
// export const updateContactTagById = (id, contactTag) =>
//   contactTagRef.updateById(id, contactTag);
// export const createContactTag = contactTag => contactTagRef.push(contactTag);
// export const deleteContactTagById = id => contactTagRef.removeById(id);

export default tagType => {
  const ref = fireRef(getFireDB().ref(`${tagType}Tags`));

  const tagList = () => ref.arrayStream();
  const updateTag = contactTag => ref.updateById(contactTag._id, contactTag);
  const updateTagById = (id, contactTag) => ref.updateById(id, contactTag);
  const createTag = contactTag => ref.push(contactTag);
  const deleteTagById = id => ref.removeById(id);

  return {
    tagList,
    updateTag,
    updateTagById,
    createTag,
    deleteTagById
  };
};
