import R from "ramda";

export const valueContains = (str, ob, ignoreCase = true) => {
  if (!str) return true;
  return Object.values(ob)
    .filter(v => v != null)
    .filter(R.complement(R.is(Function)))
    .some(v => {
      if (R.is(Object, v)) {
        return valueContains(str, v);
      }
      return String(ignoreCase ? v.toLowerCase() : v).includes(
        ignoreCase ? str.toLowerCase() : str
      );
    });
};

export const propContains = R.curry((str, props, ob) =>
  valueContains(str, R.pick(props, ob))
);

export const toggleArrayItem = (arr = [], item, predicate = R.equals) => {
  if (item == undefined) return arr;
  return arr.find(predicate(item))
    ? arr.filter(it => !predicate(item, it))
    : [...arr, item];
};

export const objectIntersection = (first = {}, second = {}, eqFn = R.equals) =>
  R.intersection(R.keys(first), R.keys(second))
    .filter(key => eqFn(first[key], second[key]))
    .reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: first[cur]
      }),
      {}
    );

export const objectDifference = (first = {}, second = {}, eqFn = R.equals) => {
  const firstKeys = R.keys(first);
  const secondKeys = R.keys(second);
  const sameField = R.intersection(firstKeys, secondKeys).filter(key =>
    eqFn(first[key], second[key])
  );

  return [
    R.pick(R.difference(firstKeys, sameField))(first),
    R.pick(R.difference(secondKeys, sameField))(second)
  ];
};
