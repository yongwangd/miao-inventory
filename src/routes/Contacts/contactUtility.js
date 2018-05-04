export const parseTagFromLabel = label => {
  const cleanLabel = label
    .split(" ")
    .reduce((acc, cur) => acc + cur.slice(0, 1).toUpperCase() + cur.slice(1));

  const tag = {
    key: cleanLabel,
    label: cleanLabel
  };
  return tag;
};

export const a = 4;
