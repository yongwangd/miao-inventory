import React from 'react';
import { connect } from 'react-redux';
import { Modal, message } from 'antd';
import R from 'ramda';
import VendorActionItem from '../components/VendorActionItem';
import { updateVendorQuantity } from '../../../fireQuery/contactsQuery';

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
      vendorKey
    } = this.props;

    const generalParams = { contactId, variantKey, vendorKey };

    return (
      <Modal visible={visible} title={title} onCancel={onCancel} footer={null}>
        {JSON.stringify(vendorInEdit)}
        <p>Primary: {vendorInEdit.primary || 0}</p>
        <p>Secondary: {vendorInEdit.secondary || 0}</p>
        <p>Total: {vendorInEdit.total || 0}</p>
        <VendorActionItem
          onSubmit={value =>
            updateVendorQuantity({
              ...generalParams,
              type: 'primary',
              number: vendorInEdit + value
            }).then(() =>
              message.success(`Added ${value} Items to Primary Storage`)
            )}
          text="Add -> Primary:"
        />
        <VendorActionItem
          onSubmit={value =>
            updateVendorQuantity({
              ...generalParams,
              type: 'secondary',
              number: vendorInEdit.secondary - value
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
                number: vendorInEdit.primary - value
              }),
              updateVendorQuantity({
                ...generalParams,
                type: 'secondary',
                number: vendorInEdit.secondary + value
              })
            ]).then(() => message.success('success'))}
          text="Primary -> Secondary:"
        />
        <VendorActionItem text="Secondary -> Primary:" />
        <VendorActionItem text="Reset Primary to:" />
        <VendorActionItem text="Reset Secondary to:" />
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
