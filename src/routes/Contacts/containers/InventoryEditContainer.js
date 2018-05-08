import React from 'react';
import { connect } from 'react-redux';
import R from 'ramda';

import {
  Modal,
  Button,
  Spin,
  Table,
  Collapse,
  InputNumber,
  Popover,
  message,
  Icon,
  Select,
  Input
} from 'antd';
import LabelFieldSet from '../../../commonCmps/LabelFieldSet';
import TagInputContainer, {
  VariantTagInputContainer,
  VendorTagInputContainer
} from './TagInputContainer';
import {
  updateContactVariantVendors,
  updateVendorQuantity
} from '../../../fireQuery/contactsQuery';
import SimpleInputWrapper from '../../../commonCmps/SimpleInputWrapper';
import VendorActionItem from '../components/VendorActionItem';
import VendorActionContainer from './VendorActionContainer';

const { Panel } = Collapse;

const tableColumns = [
  {
    key: 'label',
    label: 'Vendor',
    dataIndex: 'vendorKey'
  },
  {
    key: 'primary',
    label: 'Primary',
    dataIndex: 'primary'
  },
  {
    key: 'secondary',
    label: 'Secondary',
    dataIndex: 'secondary'
  }
];

class InventoryEditContainer extends React.Component {
  state = {
    variantInEdit: null,
    vendorsEditCopy: null,
    vendorInEdit: null,
    vendorInEditVariant: null
  };

  render() {
    const {
      variantInEdit,
      vendorsEditCopy,
      vendorInEdit,
      vendorInEditVariant
    } = this.state;
    const { contact, variantTags, vendorTags } = this.props;
    const { variantTagKeySet } = contact;

    // const variants = getTagArray(variantTags, variantTagKeySet);
    const variantArray = Object.keys(variantTagKeySet).map(key => ({
      ...variantTags.find(k => k.key == key),
      vendors: variantTagKeySet[key]
    }));

    console.log('variant array', variantArray);
    console.log('vendors', vendorTags);
    console.log('variants', variantArray);

    const renderVariants = variants => {
      console.log('render');

      const getHeader = variant => {
        const primary = R.sum(
          R.values(variant.vendors)
            .map(v => v.primary)
            .filter(v => v)
        );
        const secondary = R.sum(
          R.values(variant.vendors)
            .map(v => v.secondary)
            .filter(v => v)
        );

        const total = primary + secondary;

        return (
          <div>
            <span>{variant.label}</span>
            <span style={{ float: 'right' }}>
              <span className="variant-header-span">
                Primary:
                <span>{primary}</span>
              </span>
              <span className="variant-header-span">
                Secondary:
                <span>{secondary}</span>
              </span>
              <span className="variant-header-span">
                Total:
                <span>{total}</span>
              </span>
            </span>
          </div>
        );
      };

      const renderVendor = (vendor, variant) => (
        <tr>
          {tableColumns.map(col => (
            <td key={col.key}>{vendor[col.dataIndex] || '0'}</td>
          ))}
          <td>{(vendor.primary || 0) + (vendor.secondary || 0)}</td>
          <td>
            <a
              onClick={() =>
                this.setState({
                  vendorInEdit: vendor,
                  vendorInEditVariant: variant
                })}
            >
              Edit
            </a>
          </td>
        </tr>
      );

      return (
        <Collapse bordered={false} defaultActiveKey={['1']}>
          {variantArray.map(variant => (
            <Panel key={variant.id} header={getHeader(variant)}>
              {JSON.stringify(variant)}
              <table className="table table-hover table-sm ">
                <thead>
                  <tr>
                    {tableColumns.map(col => (
                      <th scope="col" key={col.key}>
                        {col.label}
                      </th>
                    ))}
                    <th scope="col">Total</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(variant.vendors || {})
                    .map(([vendorKey, value]) => ({
                      vendorKey,
                      ...value
                    }))
                    .map(vendor => renderVendor(vendor, variant))}
                </tbody>
              </table>

              <Button
                size="small"
                type="primary"
                style={{ marginTop: 15 }}
                onClick={() => {
                  console.log('variant in click', variant);
                  this.setState({
                    variantInEdit: variant,
                    vendorsEditCopy: { ...variant.vendors }
                  });
                }}
              >
                Add Vendor
              </Button>
            </Panel>
          ))}
        </Collapse>
      );
    };

    return (
      <Spin spinning={false}>
        <div>
          {/* <LabelFieldSet label="VariantTags">
            <div style={{ borderBottom: '1px solid lightgray' }}>
              <VariantTagInputContainer selectedTagSet={variantTagKeySet} />
            </div>
          </LabelFieldSet> */}

          {renderVariants(variantArray)}

          {vendorInEdit && (
            <VendorActionContainer
              contactId={contact._id}
              variantKey={vendorInEditVariant.key}
              vendorKey={vendorInEdit.vendorKey}
              visible={vendorInEdit != null}
              title={`Edit Inventory for ${vendorInEdit.vendorKey}`}
              onCancel={() => this.setState({ vendorInEdit: null })}
            />
          )}

          {variantInEdit && (
            <Modal
              visible={variantInEdit != null}
              title={'Edit Vendors'}
              onCancel={() => this.setState({ variantInEdit: null })}
              onOk={() => {
                updateContactVariantVendors(
                  contact._id,
                  variantInEdit.key,
                  this.state.vendorsEditCopy
                );
                this.setState({
                  vendorsEditCopy: null,
                  variantInEdit: null
                });
              }}
            >
              <VendorTagInputContainer
                selectedTagSet={vendorsEditCopy}
                onTagSetChange={keySet => {
                  const diff = R.pickBy(
                    (val, key) => !R.has(key, variantInEdit.vendors),
                    keySet
                  );
                  this.setState({
                    vendorsEditCopy: {
                      ...variantInEdit.vendors,
                      ...diff
                    }
                  });
                }}
                closable={false}
              />
            </Modal>
          )}
        </div>
      </Spin>
    );
  }
}

export default connect((state, ownProps) => ({
  variantTags: state.variantTagChunk.tags,
  vendorTags: state.vendorTagChunk.tags,
  contact: state.contactChunk.contacts.find(c => c._id == ownProps.contactId)
}))(InventoryEditContainer);
