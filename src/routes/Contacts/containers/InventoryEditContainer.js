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
  removeContactVariant
} from '../../../fireQuery/contactsQuery';
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
    vendorInEditVariant: null,
    addingVariants: false,
    variantsEditCopy: null
  };

  exportInventory = () => {
    const { contact } = this.props;

    let csv = `Product,Variant,Vendor,Primary,Secondary,Total\n`;
    const contacts = [contact];

    const variantStep = R.flatten(
      contacts.map(ct => {
        const { name, variantTagKeySet } = ct;

        return Object.entries(
          variantTagKeySet
        ).map(([variantKey, variantValue]) => ({
          name,
          variant: variantKey,
          variantValue
        }));
      })
    );

    console.log('variant step', variantStep);

    const vendorStep = R.flatten(
      variantStep.map(vt => {
        const { variant, name, variantValue } = vt;
        return Object.entries(variantValue).map(([vendorKey, vendorValue]) => {
          const { primary = 0, secondary = 0 } = vendorValue;
          return {
            name,
            variant,
            vendor: vendorKey,
            primary,
            secondary,
            total: primary + secondary
          };
        });
      })
    );

    csv += vendorStep.map(step => R.values(step).join(',')).join('\n');

    console.log(vendorStep, 'vendorStep');

    const filename = 'inventory.csv';
    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }
    const data = encodeURI(csv);

    const link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
  };

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

    // const variants = getTagArray(variantTags, variantTagKeySet);
    const variantArray = Object.keys(variantTagKeySet || {}).map(key => ({
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
        <div>
          {variantArray.length == 0 && <p>No Variants</p>}
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
          <a onClick={exportInventory}>Export</a>

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
