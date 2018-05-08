import React from 'react';
import { connect } from 'react-redux';
import { Modal, message, Popconfirm, Button } from 'antd';
import R from 'ramda';
import VendorActionItem from '../components/VendorActionItem';
import {
  updateVendorQuantity,
  removeVendorFromVariant
} from '../../../fireQuery/contactsQuery';

class VendorActionContainer extends React.Component {
  state = {};
  render() {
    const {
      visible,
      title,
      onCancel,
      vendorInEdit,
      contactId,
      variantKey,
      vendorKey,
      onVendorRemoved
    } = this.props;

    const generalParams = { contactId, variantKey, vendorKey };

    const { primary = 0, secondary = 0 } = vendorInEdit;

    if (!vendorInEdit) {
      return <div />;
    }

    return (
      <Modal
        visible={visible && vendorInEdit}
        title={title}
        onCancel={onCancel}
        footer={null}
      >
        {JSON.stringify(vendorInEdit)}
        <p>Primary: {primary}</p>
        <p>Secondary: {secondary}</p>
        <p>Total: {primary + secondary}</p>
        <VendorActionItem
          onSubmit={value => {
            console.log(value);
            updateVendorQuantity({
              ...generalParams,
              type: 'primary',
              number: primary + value
            }).then(() =>
              message.success(`Added ${value} Items to Primary Storage`)
            );
          }}
          text="Add -> Primary:"
        />
        <VendorActionItem
          onSubmit={value =>
            updateVendorQuantity({
              ...generalParams,
              type: 'secondary',
              number: secondary - value
            }).then(() =>
              message.success(`Removed ${value} from Secondary Storage`)
            )}
          text="Remove <- Secondary"
        />
        <VendorActionItem
          onSubmit={value =>
            Promise.all([
              updateVendorQuantity({
                ...generalParams,
                type: 'primary',
                number: primary - value
              }),
              updateVendorQuantity({
                ...generalParams,
                type: 'secondary',
                number: secondary + value
              })
            ]).then(() => message.success('success'))}
          text="Primary -> Secondary:"
        />
        <VendorActionItem text="Secondary -> Primary:" />
        <VendorActionItem
          onSubmit={value =>
            updateVendorQuantity({
              ...generalParams,
              type: 'primary',
              number: value
            }).then(() => message.success('reset'))}
          text="Reset Primary to:"
        />
        <VendorActionItem text="Reset Secondary to:" />

        <Popconfirm
          title="Are you sure to Remove this Vendor?"
          onConfirm={() => {
            removeVendorFromVariant(
              contactId,
              variantKey,
              vendorKey
            ).then(() => {
              message.success('Vendor Removed');
              onVendorRemoved();
            });
          }}
        >
          <Button type="danger">Remove this Vendor</Button>
        </Popconfirm>
      </Modal>
    );
  }
}

const mapState = (state, ownProps) => {
  const { contactId, variantKey, vendorKey } = ownProps;
  const { contacts } = state.contactChunk;
  const vendorInEdit = R.path(
    ['variantTagKeySet', variantKey, vendorKey],
    contacts.find(c => c._id == contactId)
  );

  return {
    ...ownProps,
    vendorInEdit
  };
};

export default connect(mapState)(VendorActionContainer);
