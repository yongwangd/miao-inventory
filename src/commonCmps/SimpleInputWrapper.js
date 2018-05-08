import React, { Component } from 'react';
import R from 'ramda';
import { Input, Button, Select } from 'antd';

export default class SimpleInputWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInput: props.showInput || false
    };
  }

  render() {
    const { showInput, inputValue } = this.state;
    const {
      error = '',
      text = 'New',
      okLabel = 'Save',
      onSubmit,
      children
    } = this.props;

    return (
      <span>
        {showInput ? (
          [
            <span>{children}</span>,

            <Button
              disabled={error}
              type="primary"
              size="small"
              style={{ marginLeft: 15 }}
              onClick={() => {
                this.setState({ showInput: false });
                onSubmit();
              }}
            >
              {okLabel}
            </Button>,
            <a
              style={{ marginLeft: 15 }}
              onClick={() =>
                this.setState({ showInput: false, inputValue: '' })}
            >
              Cancel
            </a>
          ]
        ) : (
          <Button
            icon="plus"
            type="primary"
            size="small"
            onClick={() => this.setState({ showInput: true })}
          >
            {text}
          </Button>
        )}
      </span>
    );
  }
}
