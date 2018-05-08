import React, { Component } from 'react';
import R from 'ramda';
import { Input, Button, Select } from 'antd';

export default class SimpleSelectButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInput: props.showInput || false,
      inputValue: ''
    };
  }

  render() {
    const { showInput, inputValue } = this.state;
    const {
      text = 'New',
      okLabel = 'Save',
      onSubmit,
      getErrorMsg = R.always('')
    } = this.props;

    const errMsg = getErrorMsg(inputValue);

    const onSubmitValue = () => {
      if (errMsg) return;
      const value = this.state.inputValue.trim();

      return Promise.resolve(onSubmit(value)).then(() => {
        this.setState({
          showInput: false,
          inputValue: ''
        });
      });
    };

    return (
      <span>
        {showInput ? (
          [
            <Select
              value={inputValue}
              style={{ width: 180 }}
              size="small"
              onChange={e => this.setState({ inputValue: e.target.value })}
            />,
            errMsg && (
              <span className="tag-error danger text-danger">
                {getErrorMsg(inputValue)}
              </span>
            ),

            !errMsg && (
              <Button
                disabled={getErrorMsg(inputValue)}
                type="primary"
                size="small"
                style={{ marginLeft: 15 }}
                onClick={onSubmitValue}
              >
                {okLabel}
              </Button>
            ),
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
