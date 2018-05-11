import React from 'react';

const TagList = props => {
  const { tags, activeTagKeys, color, onClose, ...rest } = props;
  const renderTag = tag => (
    <span className="tag-span" key={tag.key}>
      <span
        className="badge"
        style={{
          fontSize: 15
        }}
      >
        @{tag.label}
      </span>
    </span>
  );

  return <span {...rest}>{tags.map(renderTag)}</span>;
};

export default TagList;
