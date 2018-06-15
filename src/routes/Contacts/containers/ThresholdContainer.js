import React, { Component } from 'react';
import { Button, Modal, InputNumber } from 'antd';
import ModalContainer from '../../../commonCmps/ModalContainer';
import { updateVendorTresholdMin } from '../../../fireQuery/contactsQuery';
import { NAVY } from '../../../properties/Colors';

export default class ThresholdContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.thresholdMin || null
    };
  }
  render() {
    const { value } = this.state;
    const { thresholdMin, valid, submit, removeThreshold } = this.props;
    const badgeClass = `badge badge-${valid ? 'success' : 'danger'}`;
    return (
      <ModalContainer>
        {({ visible, show, hide }) => (
          <span>
            {thresholdMin == null && (
              <a className="text-primary" onClick={show}>
                Add Threshold
              </a>
            )}
            {thresholdMin != null && [
              <a style={{ fontSize: 14 }}>Threshold:</a>,
              <a
                className="text-primary"
                style={{ fontSize: 18, marginLeft: 8 }}
                onClick={show}
              >
                {thresholdMin}
              </a>
            ]}
            <Modal
              title="Warn me when inventory is below ->"
              visible={visible}
              onOk={() => submit(value).then(hide)}
              onCancel={hide}
            >
              <InputNumber
                autoFocus
                min={0}
                style={{ width: 100 }}
                value={value}
                onChange={value => this.setState({ value })}
                ref={elm => {
                  console.log(elm);
                  this.inputElm = elm;
                }}
              />
              {thresholdMin != null && (
                <Button
                  onClick={() => removeThreshold().then(hide)}
                  style={{ float: 'right' }}
                  type="danger"
                >
                  Remove Threshold
                </Button>
              )}
            </Modal>
          </span>
        )}
      </ModalContainer>
    );
  }
}
