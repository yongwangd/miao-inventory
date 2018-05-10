import R from 'ramda';

export const parseTagFromLabel = label => {
  const cleanLabel = label
    .replace(/\W/g, '')
    .split(' ')
    .reduce((acc, cur) => acc + cur.slice(0, 1).toUpperCase() + cur.slice(1));

  const tag = {
    key: cleanLabel,
    label: cleanLabel
  };
  return tag;
};

export const exportContactInventory = (
  contacts,
  filename = 'inventory.csv'
) => {
  let csv = `Product,Variant,Vendor,Primary,Secondary,Total\n`;

  const variantStep = R.flatten(
    contacts.map(ct => {
      const { name, variantTagKeySet } = ct;

      return Object.entries(
        variantTagKeySet
      ).map(([variantKey, variantValue]) => ({
        name,
        variant: variantKey,
        variantValue
      }));
    })
  );

  console.log('variant step', variantStep);

  const vendorStep = R.flatten(
    variantStep.map(vt => {
      const { variant, name, variantValue } = vt;
      return Object.entries(variantValue).map(([vendorKey, vendorValue]) => {
        const { primary = 0, secondary = 0 } = vendorValue;
        return {
          name,
          variant,
          vendor: vendorKey,
          primary,
          secondary,
          total: primary + secondary
        };
      });
    })
  );

  csv += vendorStep.map(step => R.values(step).join(',')).join('\n');

  console.log(vendorStep, 'vendorStep');

  // const filename = `${}inventory.csv`;
  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }
  const data = encodeURI(csv);

  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
};

export const a = 4;
