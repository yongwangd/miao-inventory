import R from 'ramda';

function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

const formatText = (text, contacts, variants, vendors) => {
  let index = 0;
  const regex = new RegExp(`(?<=\\t\\s\\d+)\\s`);
  const trans = text.split(regex).map(rawRow => {
    const row = rawRow
      .split(/[\s\t]/)
      .filter(d => d)
      .map(x => x.replace("''", '"'));
    console.log(row);

    let [inter, qty] = [R.init(row), R.last(row)];

    let firstOne = R.head(inter);

    if (R.last(firstOne) == `"`) {
      firstOne = R.init(firstOne);
      const lastIndex = R.findLastIndex(isLetter, firstOne);

      console.log(firstOne, lastIndex);

      inter = [
        firstOne.slice(0, lastIndex + 1),
        firstOne.slice(lastIndex + 1),
        ...inter.slice(1)
      ];
    }

    console.log(inter, 'inter');
    const [code, rawVariant, rawVendor] = inter;

    return {
      index: index++,
      code,
      rawVariant,
      rawVendor,
      qty
    };
  });

  console.log('trans is ', trans);

  return trans;
};

export const parsePasteText = (text, contacts, variants, vendors) => {
  const trans = formatText(text);

  const resultArray = trans
    .map(row => {
      const variant = variants.find(
        v =>
          v.key.toLowerCase() == row.rawVariant && row.rawVariant.toLowerCase()
      );
      const vendor = vendors.find(
        v => v.key.toLowerCase() == row.rawVendor && row.rawVendor.toLowerCase()
      );
      return {
        ...row,
        variantKey: variant && variant.key,
        vendorKey: vendor && vendor.key
      };
    })
    .map(row => {
      const { variantKey, vendorKey } = row;
      const found = contacts.find(c => c.code == row.code);

      const toReturn = {
        ...row
      };

      if (found) {
        console.log(found);
        toReturn.exist = true;
        toReturn.name = found.name;
        toReturn._id = found._id;
        const variantValue = R.path(['variantTagKeySet', variantKey], found);
        toReturn.variantExist = variantValue != null;
        const vendorValue = R.path(
          ['variantTagKeySet', variantKey, vendorKey],
          found
        );
        if (vendorValue) {
          const { primary = 0, secondary = 0 } = vendorValue;
          toReturn.vendorExist = true;
          toReturn.primary = primary;
          toReturn.secondary = secondary;
          toReturn.total = primary + secondary;
        } else {
          toReturn.vendorExist = false;
        }
      } else {
        toReturn.exist = false;
      }

      return toReturn;
    });

  console.log('lsasss', resultArray);
  return resultArray;
};
