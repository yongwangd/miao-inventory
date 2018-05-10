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

export const downloadCSV = (csv, filename) => {
  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;charset=utf-8,${csv}`;
  }
  const data = encodeURI(csv);

  const link = document.createElement('a');
  link.setAttribute('href', data);
  link.setAttribute('download', filename);
  link.click();
};

export const getContactInventorySummary = contact => {
  let r = R.flatten(
    R.values(contact.variantTagKeySet || {}).map(vendors => R.values(vendors))
  ).filter(R.is(Object));
  console.log('rrrr', r);
  r = r.reduce(
    (acc, cur) => ({
      primary: acc.primary + cur.primary || 0,
      secondary: acc.secondary + cur.secondary || 0
    }),
    { primary: 0, secondary: 0 }
  );

  const total = r.primary + r.secondary;
  return {
    primary: r.primary,
    secondary: r.secondary,
    total
  };
};

export const exportContactSummary = (
  contacts,
  filename = 'inventory-summary.csv'
) => {
  let csv = `Product,Primary,Secondary,Total\n`;
  csv += contacts
    .map(ct => {
      const su = getContactInventorySummary(ct);
      return [ct.name, su.primary, su.secondary, su.total].join(',');
    })
    .join('\n');
  downloadCSV(csv, filename);
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
        variantTagKeySet || {}
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
      return Object.entries(
        variantValue || {}
      ).map(([vendorKey, vendorValue]) => {
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

  downloadCSV(csv, filename);

  // const filename = `${}inventory.csv`;
  // if (!csv.match(/^data:text\/csv/i)) {
  //   csv = `data:text/csv;charset=utf-8,${csv}`;
  // }
  // const data = encodeURI(csv);

  // const link = document.createElement('a');
  // link.setAttribute('href', data);
  // link.setAttribute('download', filename);
  // link.click();
};

export const a = 4;
