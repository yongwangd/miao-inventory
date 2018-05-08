import React from 'react';
import { Input, InputNumber, Button } from 'antd';

const VendorActionItem = props => {
  const { amount, min = 0, max = 1000, text = 'Pick a NUmber' } = props;

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>{text}</div>
      <div>
        <InputNumber style={{ width: 100, marginRight: 15 }} />
        <Button type="primary">OK</Button>
      </div>
    </div>
  );
};

export default VendorActionItem;
