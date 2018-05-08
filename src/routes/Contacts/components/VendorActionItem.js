import React from 'react';
import { InputNumber, Button } from 'antd';

class VendorActionItem extends React.Component {
  state = {
    value: 0
  };

  onValueChange = value => this.setState({ value });

  render() {
    const {
      min = 0,
      max = 1000,
      text = 'Pick a NUmber',
      onSubmit
    } = this.props;
    const { value } = this.state;
    const { onValueChange } = this;

    return (
      <div style={{ display: 'flex', marginBottom: 10 }}>
        <div style={{ flex: 1 }}>{text}</div>
        <div>
          <InputNumber
            style={{ width: 100, marginRight: 15 }}
            defaultValue={value}
            onChange={onValueChange}
          />
          <Button type="primary" size="small" onClick={() => onSubmit(value)}>
            OK
          </Button>
        </div>
      </div>
    );
  }
}

export default VendorActionItem;
