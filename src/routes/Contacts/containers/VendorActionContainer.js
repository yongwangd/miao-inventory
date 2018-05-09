import React from 'react';
import { connect } from 'react-redux';
import { Modal, message, Popconfirm, Button, Badge, Tag } from 'antd';
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

    if (!vendorInEdit) {
      return <div />;
    }

    const generalParams = { contactId, variantKey, vendorKey };

    const { primary = 0, secondary = 0 } = vendorInEdit;
    const total = primary + secondary;

    return (
      <Modal
        visible={visible && vendorInEdit}
        title={title}
        onCancel={onCancel}
        footer={null}
      >
        <p className="vendor-header-p">
          {/* <a>Primary:</a>
          <span className="badge badge-danger">{primary}</span>
          <a>Secondary:</a>
          <span className="badge badge-danger">{secondary}</span> */}
          <a>Total:</a>
          <span className="badge badge-danger">{total}</span>
        </p>

        <div>
          <svg id="action-svg" width="500" height="160">
            <marker
              id="Triangle"
              viewBox="0 0 10 10"
              refX="1"
              refY="5"
              markerWidth="1.8"
              markerHeight="1.8"
              orient="auto"
              fill="orange"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
            <rect
              rx="15"
              ry="15"
              x="100"
              y="40"
              width="100"
              height="100"
              stroke="#87d068"
              strokeWidth="5"
              fill="white"
            />
            <rect
              rx="15"
              ry="15"
              x="300"
              y="40"
              width="100"
              height="100"
              stroke="#87d068"
              strokeWidth="5"
              fill="white"
            />
            <line
              id="moveToSecondary"
              x1="200"
              y1="60"
              x2="270"
              y2="60"
              markerEnd="url(#Triangle)"
            />
            <line
              id="moveToPrimary"
              x1="300"
              y1="120"
              x2="230"
              y2="120"
              markerEnd="url(#Triangle)"
            />
            <line
              id="addToPrimary"
              x1="20"
              y1="90"
              x2="70"
              y2="90"
              markerEnd="url(#Triangle)"
            />
            <line
              x1="400"
              y1="90"
              x2="460"
              y2="90"
              markerEnd="url(#Triangle)"
            />
            <text
              onClick={() => alert('text click')}
              x="150"
              y="30"
              fontSize="20"
              textAnchor="middle"
              fontWeight="bold"
              fill="black"
            >
              Primary
            </text>
            <text
              onClick={() => alert('text click')}
              x="350"
              y="30"
              fontSize="20"
              textAnchor="middle"
              fontWeight="bold"
              fill="black"
            >
              Secondary
            </text>
            <text
              onClick={() => alert('text click')}
              x="150"
              y="100"
              fontSize="35"
              textAnchor="middle"
              fontWeight="bold"
              fill="#87d068"
              style={{ cursor: 'pointer' }}
            >
              {primary}
            </text>
            <text
              onClick={() => alert('text click')}
              x="350"
              y="100"
              fontSize="35"
              textAnchor="middle"
              fontWeight="bold"
              fill="#87d068"
            >
              {secondary}
            </text>
          </svg>
        </div>

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
            }).then(() => message.success(`Primary Storage Reset To ${value}`))}
          text="Reset Primary to:"
        />
        <VendorActionItem
          onSubmit={value =>
            updateVendorQuantity({
              ...generalParams,
              type: 'secondary',
              number: value
            }).then(() =>
              message.success(`Secondary Storage Reset to ${value}`)
            )}
          text="Reset Secondary to:"
        />
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
