import React from 'react';
import { connect } from 'react-redux';
import R from 'ramda';
import {
  Modal,
  Button,
  Spin,
  Collapse,
  message,
  Icon,
  Dropdown,
  Popconfirm
} from 'antd';
import {
  VariantTagInputContainer,
  VendorTagInputContainer
} from './TagInputContainer';
import {
  updateContactVariantVendors,
  updateContactVariants,
  removeContactVariant,
  updateVariantTresholdMin,
  removeVariantTresholdMin
} from '../../../fireQuery/contactsQuery';
import VendorActionContainer from './VendorActionContainer';
import {
  exportContactInventory,
  getContactInventorySummary,
  removePropertiesRecur,
  cleanMetaData
} from '../contactUtility';
import InventoryCount from '../components/InventoryCount';
import ThresholdContainer from './ThresholdContainer';
import { RED, YELLOW } from '../../../properties/Colors';

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
    vendorInEditVariant: null,
    addingVariants: false,
    variantsEditCopy: null
  };

  exportInventory = () =>
    exportContactInventory([this.props.contact], `${this.props.contact.name}`);

  render() {
    const {
      variantInEdit,
      vendorsEditCopy,
      vendorInEdit,
      vendorInEditVariant,
      addingVariants,
      variantsEditCopy
    } = this.state;
    const { contact, variantTags, vendorTags } = this.props;
    const { variantTagKeySet } = contact;
    const { exportInventory } = this;

    const summary = getContactInventorySummary(contact);

    // const variants = getTagArray(variantTags, variantTagKeySet);
    // const variantArray = Object.keys(variantTagKeySet || {})
    //   // .filter(key => !key.startsWith('$_'))
    //   .map(key => ({
    //     ...variantTags.find(k => k.key == key),
    //     vendors: variantTagKeySet[key]
    //   }));

    const variantArray = Object.keys(variantTagKeySet || {}).map(key => ({
      ...variantTags.find(k => k.key == key),
      ...R.pickBy((v, k) => k.startsWith('$_'), variantTagKeySet[key]),
      vendors: R.pickBy((v, k) => !k.startsWith('$_'), variantTagKeySet[key])
    }));

    console.log('variant array', variantArray);
    console.log('vendors', vendorTags);
    console.log('variants', variantArray);

    const renderVariants = variants => {
      console.log('render');

      const getHeader = variant => {
        console.log(variant, 'variant--');
        const primary = variant.$_primaryCount;
        const secondary = variant.$_secondaryCount;
        const thresholdMin = variant.$_thresholdMin;
        const inventoryValid = variant.$_inventoryValid;

        const total = primary + secondary;
        const menu = (
          <ul className="list-group">
            <li className="list-group-item">
              <a
                className="text-primary"
                onClick={e => {
                  e.preventDefault();
                  this.setState({
                    variantInEdit: variant,
                    vendorsEditCopy: { ...variant.vendors }
                  });
                }}
              >
                Add Vendors
              </a>
            </li>
            <li className="list-group-item">
              <ThresholdContainer
                thresholdMin={thresholdMin}
                valid={inventoryValid}
                submit={min =>
                  updateVariantTresholdMin({
                    contactId: contact._id,
                    variantKey: variant.key,
                    min
                  })}
                removeThreshold={() =>
                  removeVariantTresholdMin({
                    contactId: contact._id,
                    variantKey: variant.key
                  })}
              />
            </li>
            <li className="list-group-item">
              <Popconfirm
                title={`Are you sure to Delete [${variant.label}]`}
                onConfirm={e => {
                  e.stopPropagation();
                  removeContactVariant(contact._id, variant.key).then(() => {
                    message.success('Variant Removed');
                  });
                }}
                okText="Yes"
                cancelText="No"
              >
                <a className="text-danger">Remove Variant</a>
              </Popconfirm>
            </li>
          </ul>
        );

        const badgeClass = `badge badge-${variant.$_thresholdMin == null ||
        variant.$_inventoryValid
          ? 'light'
          : 'danger'}`;

        return (
          <div style={{ display: 'flex' }}>
            <span
              className="text-secondary"
              style={{
                fontWeight: 'bold',
                fontSize: 16
              }}
            >
              {variant.label}
            </span>
            <span
              style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}
            >
              <span className="variant-header-span">
                Primary:
                <span
                  className="badge badge-light"
                  style={{ display: 'inline-block', width: 35 }}
                >
                  {primary}
                </span>
              </span>
              <span className="variant-header-span">
                Secondary:
                <span
                  className="badge badge-light"
                  style={{ display: 'inline-block', width: 35 }}
                >
                  {secondary}
                </span>
              </span>
              <span className="variant-header-span">
                Total:
                <span
                  className={`badge badge-${variant.$_inventoryValid
                    ? 'light'
                    : 'danger'}`}
                  style={{ display: 'inline-block', width: 35 }}
                >
                  {total}
                </span>
              </span>
              <span className="variant-header-span">
                Threshold:
                <span
                  className={badgeClass}
                  style={{ display: 'inline-block', width: 35 }}
                >
                  {thresholdMin}
                </span>
              </span>
              <Dropdown overlay={menu}>
                <Icon
                  style={{
                    fontSize: 17,
                    marginLeft: 15,
                    color: 'black',
                    marginRight: 10
                  }}
                  type="setting"
                />
              </Dropdown>
            </span>
          </div>
        );
      };

      const renderVendor = (vendor, variant) => (
        <tr
          style={{
            cursor: 'pointer',
            backgroundColor: vendor.$_inventoryValid ? '' : YELLOW
          }}
          onClick={() =>
            this.setState({
              vendorInEdit: vendor,
              vendorInEditVariant: variant
            })}
        >
          {tableColumns.map(col => (
            <td key={col.key}>{vendor[col.dataIndex] || '0'}</td>
          ))}
          <td>{(vendor.primary || 0) + (vendor.secondary || 0)}</td>
          <td>{vendor.thresholdMin}</td>
          {/* <td>
            <a
              onClick={() =>
                this.setState({
                  vendorInEdit: vendor,
                  vendorInEditVariant: variant
                })}
            >
              Edit
            </a>
          </td> */}
        </tr>
      );

      return (
        <div>
          {variantArray.length == 0 && (
            <p className="text-danger" style={{ fontSize: 18 }}>
              No Variants
            </p>
          )}
          <Collapse defaultActiveKey={['1']}>
            {variantArray != null &&
              variantArray.length > 0 &&
              variantArray.map(variant => (
                <Panel key={variant.id} header={getHeader(variant)}>
                  {Object.keys(variant.vendors || {}).length == 0 ? (
                    [
                      <p>No Vendors</p>,
                      <Button
                        size="small"
                        onClick={e => {
                          e.preventDefault();
                          this.setState({
                            variantInEdit: variant,
                            vendorsEditCopy: { ...variant.vendors }
                          });
                        }}
                      >
                        Add Vendors
                      </Button>
                    ]
                  ) : (
                    <table
                      className="table table-hover table-sm "
                      style={{ border: '1px solid lightgray' }}
                    >
                      <thead>
                        <tr>
                          {tableColumns.map(col => (
                            <th scope="col" key={col.key}>
                              {col.label}
                            </th>
                          ))}
                          <th scope="col">Total</th>
                          <th scope="col">Threshold</th>
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
                  )}
                </Panel>
              ))}
          </Collapse>
        </div>
      );
    };

    return (
      <Spin spinning={false}>
        <div>
          {variantArray.length > 0 && (
            <div style={{ marginBottom: 15 }}>
              <InventoryCount {...summary} />
            </div>
          )}
          {renderVariants(variantArray)}

          <Button
            type="primary"
            size="small"
            style={{ marginTop: 10 }}
            onClick={() =>
              this.setState({
                addingVariants: true,
                variantsEditCopy: { ...(variantTagKeySet || {}) }
              })}
          >
            Add Variants
          </Button>
          {variantArray.length > 0 && (
            <a
              className="text-primary"
              style={{ marginLeft: 20 }}
              onClick={exportInventory}
            >
              Export
            </a>
          )}

          {vendorInEdit && (
            <VendorActionContainer
              contactId={contact._id}
              variantKey={vendorInEditVariant.key}
              vendorKey={vendorInEdit.vendorKey}
              visible={vendorInEdit != null}
              title={`Edit Inventory for ${vendorInEdit.vendorKey}`}
              onVenderRemoved={() => this.setState({ vendorInEdit: null })}
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
          {addingVariants && (
            <Modal
              visible={addingVariants}
              title={'Add Variants'}
              onCancel={() => this.setState({ addingVariants: false })}
              onOk={() => {
                updateContactVariants(
                  contact._id,
                  this.state.variantsEditCopy
                ).then(() => {
                  message.success('Variants Added');
                  this.setState({
                    variantsEditCopy: null,
                    addingVariants: null
                  });
                });
              }}
            >
              <VariantTagInputContainer
                closable={false}
                selectedTagSet={variantsEditCopy}
                onTagSetChange={keySet => {
                  const diff = R.pickBy(
                    (val, key) => !R.has(key, variantTagKeySet || {}),
                    keySet
                  );
                  this.setState({
                    variantsEditCopy: {
                      ...variantTagKeySet,
                      ...diff
                    }
                  });
                }}
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
