import R from 'ramda';

const dateString = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

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
  link.setAttribute('download', `${filename}_${dateString()}.csv`);
  link.click();
};

export const getContactVendors = contact =>
  R.compose(
    R.uniq,
    R.flatten,
    R.map(R.keys),
    R.values,
    R.prop('variantTagKeySet')
  )(contact);

export const getContactInventorySummary = contact => {
  const temp = R.flatten(
    R.values(contact.variantTagKeySet || {}).map(vendors => R.values(vendors))
  ).filter(R.is(Object));
  const r = temp.reduce(
    (acc, cur) => ({
      primary: acc.primary + (cur.primary || 0),
      secondary: acc.secondary + (cur.secondary || 0)
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

const getContactVendorArray = contacts => {
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

  return vendorStep;
};

const exportVendorStep = (vendorStep, filename) => {
  console.log('vendorstep', vendorStep);
  let csv = `Product,Variant,Vendor,Primary,Secondary,Total\n`;
  csv += vendorStep.map(step => R.values(step).join(',')).join('\n');
  console.log(vendorStep, 'vendorStep');
  downloadCSV(csv, filename);
};

export const exportContactByVendor = (
  contacts,
  vendorKey,
  filename = 'vendor'
) => {
  const vendorStep = getContactVendorArray(contacts).filter(
    ven => ven.vendor == vendorKey
  );
  exportVendorStep(vendorStep, filename);
};

export const exportContactByMultipleVendors = (contacts, vendorKeys) => {
  let csv = `Product,Variant,${vendorKeys.join(',')},Total\n`;

  // const filtered = contacts.filter(
  //   ct => R.intersection(getContactVendors(ct), vendorKeys).length > 0
  // );

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

  const resultArray = variantStep
    .filter(
      vs => R.intersection(R.keys(vs.variantValue), vendorKeys).length > 0
    )
    .map(ct => {
      const { name, variant, variantValue } = ct;

      const toReturn = {
        name,
        variant
      };

      R.forEach(
        vk =>
          (toReturn[vk] = R.add(
            R.pathOr(0, [vk, 'primary'], variantValue),
            R.pathOr(0, [vk, 'secondary'], variantValue)
          )),
        vendorKeys
      );

      toReturn.total = vendorKeys.reduce((acc, cur) => acc + toReturn[cur], 0);

      return toReturn;
    });

  csv += resultArray.map(r => R.values(r).join(',')).join('\n');
  downloadCSV(csv, vendorKeys.join('-'));
};

export const exportContactSummary = (
  contacts,
  filename = 'inventory-summary'
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

export const exportContactInventory = (contacts, filename = 'inventory') => {
  const vendorStep = getContactVendorArray(contacts);
  exportVendorStep(vendorStep, filename);
};

export const a = 4;
