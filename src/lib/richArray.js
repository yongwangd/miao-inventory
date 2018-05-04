import { T, identity, is } from "ramda";

const RichArray = elm => elm || [];

if (!Array.prototype.concatMap) {
  Array.prototype.concatMap = function(mapFn = identity) {
    return this.map((x, i) => mapFn(x, i)).reduce(
      (acc, cur) => acc.concat(cur),
      []
    );
  };
}

if (!Array.prototype.mapIf) {
  Array.prototype.mapIf = function(predicateFn = T, mapFn = identity) {
    return this.map((x, i) => (predicateFn(x, i) ? mapFn(x, i) : x));
  };
}

if (!Array.prototype.sortBy) {
  Array.prototype.sortBy = function(sort, reverse = false) {
    if (is(Function, sort)) {
      return this.sort(
        (a, b) => (!reverse ? sort(a) > sort(b) : sort(a) < sort(b))
      );
    } else if (is(String, sort)) {
      return this.sort(
        (a, b) => (!reverse ? a[sort] > b[sort] : a[sort] < b[sort])
      );
    }
    return this;
  };
}

export default RichArray;
