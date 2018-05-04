const { toggleArrayItem } = require("../../src/lib/littleFn");

describe("little fn test", () => {
  test("add  1+2 to equals 3", () => {
    expect(1 + 2).toBe(3);
  });

  test("toggle 1 to [1,2,3] to equal [2,3]", () => {
    expect(toggleArrayItem([1, 2, 3], 1)).toEqual([2, 3]);
  });

  test("toggle 1 to undefined to equal [2,3]", () => {
    expect(toggleArrayItem(undefined, 1)).toEqual([1]);
  });

  test("toggle 1 to [] to equal [1]", () => {
    expect(toggleArrayItem([], 1)).toEqual([1]);
  });
});
