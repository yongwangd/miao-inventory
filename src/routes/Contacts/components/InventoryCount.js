import React from 'react';

const InventoryCount = props => {
  const {
    primary,
    secondary,
    total,
    spanLeft = 15,
    spanRight = 25,
    size = 'small',
    fontSize = 17,
    ...rest
  } = props;

  return (
    <span className="inventory-count-container" {...rest}>
      <span className="inventory-count">
        <a style={{ fontSize }}>Primary:</a>
        <span
          style={{ fontSize, marginLeft: spanLeft, marginRight: spanRight }}
          className={`badge ${primary > 0
            ? 'badge-danger'
            : 'badge-secondary'}`}
        >
          {primary}
        </span>
      </span>
      <span className="inventory-count">
        <a style={{ fontSize }}>Secondary:</a>
        <span
          style={{ fontSize, marginLeft: spanLeft, marginRight: spanRight }}
          className={`badge ${secondary > 0
            ? 'badge-danger'
            : 'badge-secondary'}`}
        >
          {secondary}
        </span>
      </span>
      <span className="inventory-count">
        <a style={{ fontSize }}>Total:</a>
        <span
          style={{ fontSize, marginLeft: spanLeft, marginRight: spanRight }}
          className={`badge ${total > 0 ? 'badge-danger' : 'badge-secondary'}`}
        >
          {total}
        </span>
      </span>
    </span>
  );
};

export default InventoryCount;