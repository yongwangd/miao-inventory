import React from 'react';
import { Input, InputNumber, Button } from 'antd';

const VendorActionItem = props => {
  const { amount, min = 0, max = 1000, text = 'Pick a NUmber' } = props;

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>{text}</div>
      <div>
        <Input />
        <Button>OK</Button>
      </div>
    </div>
  );
};

export default VendorActionItem;
