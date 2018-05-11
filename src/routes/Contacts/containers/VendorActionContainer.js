import React from 'react';
import { connect } from 'react-redux';
import { Modal, message, Popconfirm, Button, Badge, Tag } from 'antd';
import R from 'ramda';
import VendorActionItem from '../components/VendorActionItem';
import {
  updateVendorQuantity,
  removeVendorFromVariant
} from '../../../fireQuery/contactsQuery';
import {
  GREEN,
  SILVER,
  ORANGE,
  RED,
  BLUE,
  MAROON,
  BLACK
} from '../../../properties/Colors';
import InventoryCount from '../components/InventoryCount';

class VendorActionContainer extends React.Component {
  state = {
    showEditModal: null
  };
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

    const { showEditModal } = this.state;

    const generalParams = { contactId, variantKey, vendorKey };

    const { primary = 0, secondary = 0 } = vendorInEdit;
    const total = primary + secondary;

    // const generateResult = message =>
    //   message ? { pass: false, message } : { pass: true };

    const ACTIVE_COLOR = BLACK;
    const ENABLE_COLOR = ORANGE;
    const DISABLE_COLOR = SILVER;
    const RECT_ACTIVE_COLOR = GREEN;

    const modes = {
      newToPrimary: {
        line: true,
        x1: 20,
        y1: 90,
        x2: 70,
        y2: 90,
        text: 'Add to Primary Storage: ',
        enabled: true,
        min: 1,
        valid: value => value > 0,
        onSubmit: value =>
          updateVendorQuantity({
            ...generalParams,
            type: 'primary',
            number: primary + value
          }).then(() =>
            message.success(`Added ${value} Items to Primary Storage`)
          )
      },
      moveToSecondary: {
        line: true,
        x1: 200,
        y1: 60,
        x2: 270,
        y2: 60,
        text: 'Move from Primary to Secondary',
        enabled: primary > 0,
        min: 1,
        max: primary,
        valid: value => value > 0 && value <= primary,
        onSubmit: value =>
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
          ]).then(() => message.success('success'))
      },
      moveToPrimary: {
        line: true,
        x1: 300,
        y1: 120,
        x2: 230,
        y2: 120,
        text: 'Move from Secondary to Primary',
        enabled: secondary > 0,
        min: 1,
        max: secondary,
        valid: value => value > 0 && value <= secondary,
        onSubmit: value =>
          Promise.all([
            updateVendorQuantity({
              ...generalParams,
              type: 'primary',
              number: primary + value
            }),
            updateVendorQuantity({
              ...generalParams,
              type: 'secondary',
              number: secondary - value
            })
          ]).then(() => message.success('success'))
      },
      outFromSecondary: {
        line: true,
        x1: 400,
        y1: 90,
        x2: 460,
        y2: 90,
        text: 'Remove from Secondary',
        enabled: secondary > 0,
        min: 1,
        max: secondary,
        valid: value => value > 0 && value <= secondary,
        onSubmit: value =>
          updateVendorQuantity({
            ...generalParams,
            type: 'secondary',
            number: secondary - value
          }).then(() =>
            message.success(`Removed ${value} from Secondary Storage`)
          )
      },
      resetPrimary: {
        text: 'Reset Primary to:',
        min: 0,
        valid: value => value >= 0,
        onSubmit: value =>
          updateVendorQuantity({
            ...generalParams,
            type: 'primary',
            number: value
          }).then(() => message.success(`Primary Storage Reset To ${value}`))
      },
      resetSecondary: {
        text: 'Reset Secondary to:',
        min: 0,
        valid: value => value >= 0,
        onSubmit: value =>
          updateVendorQuantity({
            ...generalParams,
            type: 'secondary',
            number: value
          }).then(() => message.success(`Secondary Storage Reset to ${value}`))
      }
    };

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
            <Button style={{ float: 'right' }} type="danger">
              Remove this Vendor
            </Button>
          </Popconfirm>
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
              fill={ENABLE_COLOR}
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
            <marker
              id="TriangleActive"
              viewBox="0 0 10 10"
              refX="1"
              refY="5"
              markerWidth="1.8"
              markerHeight="1.8"
              orient="auto"
              fill={ACTIVE_COLOR}
            >
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
            <marker
              id="TriangleDisabled"
              viewBox="0 0 10 10"
              refX="1"
              refY="5"
              markerWidth="1.8"
              markerHeight="1.8"
              orient="auto"
              fill={DISABLE_COLOR}
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
              stroke={primary > 0 ? RECT_ACTIVE_COLOR : DISABLE_COLOR}
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
              stroke={secondary > 0 ? RECT_ACTIVE_COLOR : DISABLE_COLOR}
              strokeWidth="5"
              fill="white"
            />

            {Object.entries(modes)
              .map(([key, value]) => ({ key, ...value }))
              .filter(mode => mode.line)
              .map(mode => (
                <line
                  key={mode.key}
                  x1={mode.x1}
                  y1={mode.y1}
                  x2={mode.x2}
                  y2={mode.y2}
                  onClick={() =>
                    mode.enabled && this.setState({ showEditModal: mode.key })}
                  markerEnd={
                    mode.key == showEditModal
                      ? 'url(#TriangleActive)'
                      : mode.enabled
                        ? 'url(#Triangle)'
                        : 'url(#TriangleDisabled)'
                  }
                  stroke={
                    mode.key == showEditModal
                      ? ACTIVE_COLOR
                      : mode.enabled ? ENABLE_COLOR : DISABLE_COLOR
                  }
                  style={{ cursor: mode.enabled ? 'pointer' : 'default' }}
                />
              ))}
            <text
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
              onClick={() => this.setState({ showEditModal: 'resetPrimary' })}
              x="150"
              y="100"
              fontSize="35"
              textAnchor="middle"
              fontWeight="bold"
              fill={
                showEditModal == 'resetPrimary'
                  ? ACTIVE_COLOR
                  : primary > 0 ? RECT_ACTIVE_COLOR : DISABLE_COLOR
              }
              style={{ cursor: 'pointer' }}
            >
              {primary}
            </text>
            <text
              onClick={() => this.setState({ showEditModal: 'resetSecondary' })}
              x="350"
              y="100"
              fontSize="35"
              textAnchor="middle"
              fontWeight="bold"
              fill={
                showEditModal == 'resetSecondary'
                  ? ACTIVE_COLOR
                  : secondary > 0 ? RECT_ACTIVE_COLOR : DISABLE_COLOR
              }
              style={{ cursor: 'pointer' }}
            >
              {secondary}
            </text>
          </svg>
        </div>
        {showEditModal &&
          modes[showEditModal] && (
            <VendorActionItem
              {...modes[showEditModal]}
              onSubmit={value =>
                modes[showEditModal]
                  .onSubmit(value)
                  .then(() => this.setState({ showEditModal: null }))}
              onCancel={() => this.setState({ showEditModal: null })}
            />
          )}
        <div style={{ marginBottom: 30 }} />
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
