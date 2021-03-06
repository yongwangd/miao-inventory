import moment from 'moment';
import R from 'ramda';
import { getFireDB } from './fireConnection';
import { fireRef } from '../lib/firedog';
import {
  addInventoryValidForContact,
  cleanMetaData
} from '../routes/Contacts/contactUtility';

const contactsRef = fireRef(getFireDB().ref('contacts/'));

export const getContactsRef = () => getFireDB().ref('contacts/');
export const contactsList = () =>
  contactsRef.arrayStream().map(arr =>
    arr
      .map(ct => ({
        ...ct,
        tagKeys: !R.is(Object, ct.tagKeys) ? {} : ct.tagKeys
      }))
      .map(addInventoryValidForContact)
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
    [propertyName]: cleanMetaData(value)
  });
};

export const updateContactVariantVendors = (contactId, variantKey, values) =>
  getFireDB()
    .ref(`contacts/${contactId}/variantTagKeySet/${variantKey}`)
    .set(cleanMetaData(values));

export const removeVendorFromVariant = (contactId, variantKey, vendorKey) =>
  getFireDB()
    .ref(`contacts/${contactId}/variantTagKeySet/${variantKey}/${vendorKey}`)
    .remove();

export const updateContactVariants = (contactId, variants) => {
  console.log('variantsbeforeedit');
  // for (const va in variants) {
  //   [
  //     '$_primaryCount',
  //     '$_secondaryCount',
  //     '$_inventoryValid',
  //     '$_thresholdMin'
  //   ].forEach(key => delete variants[va][key]);

  //   for (const vendor in variants[va]) {
  //     ['$_inventoryValid', '$_thresholdMin'].forEach(
  //       key => delete variants[va][vendor][key]
  //     );
  //   }

  //   for (const te in variants[va]) {
  //     if (R.isEmpty(variants[va][te])) {
  //       variants[va][te] = true;
  //     }
  //   }
  // }

  // for (const va in variants) {
  //   if (R.isEmpty(variants[va])) {
  //     variants[va] = true;
  //   }
  // }

  const afterClean = cleanMetaData(variants);

  console.log(afterClean, 'after prep');
  return getFireDB()
    .ref(`contacts/${contactId}/variantTagKeySet`)
    .set(afterClean);
};

export const removeContactVariant = (contactId, variantKey) => {
  const removeVariant = getFireDB()
    .ref(`contacts/${contactId}/variantTagKeySet/${variantKey}`)
    .remove();
  const removeThresholdValue = getFireDB()
    .ref(`contacts/${contactId}/thresholdValues/${variantKey}`)
    .remove();
  return Promise.all([removeVariant, removeThresholdValue]);
};

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

export const updateVendorQuantity = ({
  contactId,
  variantKey,
  vendorKey,
  type,
  number
}) =>
  getFireDB()
    .ref(
      `contacts/${contactId}/variantTagKeySet/${variantKey}/${vendorKey}/${type}`
    )
    .set(number);

export const updateVendorTresholdMin = ({
  contactId,
  variantKey,
  vendorKey,
  min
}) =>
  getFireDB()
    .ref(
      `contacts/${contactId}/variantTagKeySet/${variantKey}/${vendorKey}/thresholdMin`
    )
    .set(min);

export const removeVendorThresholdMin = ({
  contactId,
  variantKey,
  vendorKey
}) =>
  getFireDB()
    .ref(
      `contacts/${contactId}/variantTagKeySet/${variantKey}/${vendorKey}/thresholdMin`
    )
    .remove();

export const updateVariantTresholdMin = ({ contactId, variantKey, min }) =>
  getFireDB()
    .ref(`contacts/${contactId}/thresholdValues/${variantKey}/thresholdMin`)
    .set(min);

export const removeVariantTresholdMin = ({ contactId, variantKey }) =>
  getFireDB()
    .ref(`contacts/${contactId}/thresholdValues/${variantKey}/thresholdMin`)
    .remove();

export const deleteContactById = id => contactsRef.removeById(id);
