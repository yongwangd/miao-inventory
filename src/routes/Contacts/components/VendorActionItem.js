import React from 'react';
import { InputNumber, Button, Input } from 'antd';
import { NAVY } from '../../../properties/Colors';

class VendorActionItem extends React.Component {
  state = {
    value: null
  };

  onValueChange = value => this.setState({ value });

  render() {
    const {
      min = 0,
      max = 1000000,
      text = 'Pick a NUmber',
      onSubmit,
      onCancel,
      valid = () => true
    } = this.props;
    const { value } = this.state;
    const { onValueChange } = this;

    return (
      <div style={{ display: 'flex', marginBottom: 10 }}>
        <div style={{ flex: 1, fontWeight: 'bold', fontSize: 15, color: NAVY }}>
          {text}
        </div>
        <div>
          <InputNumber
            autoFocus
            min={min}
            max={max}
            style={{ width: 100, marginRight: 15 }}
            value={value}
            onChange={onValueChange}
            ref={elm => {
              console.log(elm);
              this.inputElm = elm;
            }}
            onKeyDown={e =>
              e.key === 'Enter' && valid(value) && onSubmit(value)
            }
          />
          <Button
            disabled={!valid(value)}
            type="primary"
            size="small"
            onClick={() => onSubmit(value)}
            style={{ marginRight: 10 }}
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
