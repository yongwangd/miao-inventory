import React from "react";
import R from "ramda";

const SearchHighlight = props => {
  const { search, value = "", bg = "#ff9632", ...rest } = props;

  if (!search) {
    return <span>{value}</span>;
  }

  const buildStr = (search, value, result = []) => {
    if (!search || !value.toLowerCase().includes(search.toLowerCase())) {
      return result.concat(value);
    }
    const index = value.toLowerCase().indexOf(search.toLowerCase());
    return buildStr(
      search,
      value.slice(index + search.length),
      result.concat([
        value.slice(0, index),
        <span style={{ backgroundColor: bg }}>
          {value.slice(index, index + search.length)}
        </span>
      ])
    );
  };

  return <span {...rest}>{buildStr(search, value)}</span>;
};

export default SearchHighlight;
