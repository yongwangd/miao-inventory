import React from 'react';
import { InputNumber, Button, Input } from 'antd';

class VendorActionItem extends React.Component {
  state = {
    value: 0
  };

  onValueChange = value => this.setState({ value });

  render() {
    const {
      min = 0,
      max = 1000000,
      text = 'Pick a NUmber',
      onSubmit,
      onCancel,
      valid
    } = this.props;
    const { value } = this.state;
    const { onValueChange } = this;

    return (
      <div style={{ display: 'flex', marginBottom: 10 }}>
        <div style={{ flex: 1 }}>{text}</div>
        <div>
          <InputNumber
            min={min}
            max={max}
            style={{ width: 100, marginRight: 15 }}
            value={value}
            onChange={onValueChange}
          />
          <Button
            disabled={!valid}
            type="primary"
            size="small"
            onClick={() => onSubmit(value)}
          >
            OK
          </Button>
          <Button size="small" onClick={onCancel}>
            cancel
          </Button>
        </div>
      </div>
    );
  }
}

export default VendorActionItem;
