import R from 'ramda';

function isLetter(c) {
  return c.toLowerCase() != c.toUpperCase();
}

export const parsePasteText = (text, contacts, variants, vendors) => {
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
    const [name, variant, vendor] = inter;

    return {
      name,
      variant,
      vendor,
      qty
    };
  });

  console.log('trans is ', trans);

  return trans;
};
