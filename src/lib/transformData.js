const data = require('./miao-inventory-export.json');
const R = require('ramda');

const notEmptyObj = obj => R.is(Object, obj) && !R.isEmpty(obj);

/*eslint-disable */
var transform = data => {
  const contactDict = data.contacts;

  Object.keys(contactDict).forEach(cid => {
    const contactOb = contactDict[cid];
    const { variantTagKeySet } = contactOb;
    // delete contactOb[cid];

    console.log(variantTagKeySet);

    const variantKeys = Object.keys(contactOb.variantTagKeySet || {});

    variantKeys.forEach(vid => {
      console.log(vid, 'vid', variantTagKeySet);

      contactOb.variantTagKeySet[vid] = {
        vendorTagKeySet: contactOb.variantTagKeySet[vid]
      };
    });
  });
};

var populateThreshold = data => {
  const contactDict = data.contacts;
  Object.keys(contactDict).forEach(cid => {
    const contactOb = contactDict[cid];

    const { thresholdValues } = contactOb;
    const variantKeys = Object.keys(contactOb.variantTagKeySet || {});

    variantKeys.forEach(vid => {
      const min = R.path(['thresholdValues', vid, 'thresholdMin'], contactOb);
      if (min != null) {
        contactOb.variantTagKeySet[vid].thresholdMin = min;
      }
    });
  });
};

transform(data);
populateThreshold(data);

console.log(data.contacts);
