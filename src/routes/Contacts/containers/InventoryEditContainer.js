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
import { updateContactVariantVendors } from '../../../fireQuery/contactsQuery';
import SimpleInputWrapper from '../../../commonCmps/SimpleInputWrapper';
import VendorActionItem from '../components/VendorActionItem';

const { Panel } = Collapse;
const { Option } = Select;

const variantColumns = [
  {
    title: 'Vendor',
    dataIndex: 'vendorKey',
    key: 'label'
  },
  {
    title: 'Primary',
    dataIndex: 'primary',
    key: 'primary',
    render: (text = 0, record) => {
      const menu = (
        <div>
          <div>
            <a onClick={() => message.info('In Stock')}>New Arrivals: </a>
            <InputNumber min={0} defaultValue={0} />
          </div>

          <a onClick={() => message.info('In Move to S')}>
            Move to Secondary Storage
          </a>
          <a>Reset</a>
        </div>
      );
      return (
        <Popover content={menu} title="Actions">
          <a className="ant-dropdown-link" style={{ color: 'blue' }}>
            {text}
          </a>
          <VendorActionItem></VendorActionItem>
        </Popover>
      );
    }
  },
  {
    title: 'Secondary',
    dataIndex: 'secondary',
    key: 'secondary'
  },
  {
    title: 'Actions',
    key: 'action',
    render: (text, record) => (
      <span>
        <a>
          <Icon type="close" />
        </a>
      </span>
    )
  }
];

const getTagArray = (tags, tagKeySet) =>
  Object.keys(tagKeySet).map(key => ({
    ...tags.find(k => k.key == key),
    value: tagKeySet[key]
  }));

class InventoryEditContainer extends React.Component {
  state = {
    variantInEdit: null,
    vendorsEditCopy: null
  };

  render() {
    const { variantInEdit, vendorsEditCopy } = this.state;
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

      const getHeader = variant => (
        <div>
          <span>{variant.label}</span>
          <span style={{ float: 'right' }}>
            <span className="variant-header-span">
              Primary:
              <span>14</span>
            </span>
            <span className="variant-header-span">
              Secondary:
              <span>13</span>
            </span>
            <span className="variant-header-span">
              Total:
              <span>27</span>
            </span>
          </span>
        </div>
      );

      return (
        <Collapse bordered={false} defaultActiveKey={['1']}>
          {variantArray.map(variant => (
            <Panel key={variant.id} header={getHeader(variant)}>
              {JSON.stringify(variant)}
              <Table
                size={'small'}
                pagination={false}
                columns={variantColumns}
                dataSource={Object.entries(
                  variant.vendors || {}
                ).map(([vendorKey, value]) => ({
                  vendorKey,
                  ...value
                }))}
              />
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
              <SimpleInputWrapper
                text={'Add Vendor'}
                onSubmit={() => console.log('submit')}
              >
                <VendorTagInputContainer />
              </SimpleInputWrapper>
            </Panel>
          ))}
        </Collapse>
      );
    };

    return (
      <Spin spinning={false}>
        <div>
          <LabelFieldSet label="VariantTags">
            <div style={{ borderBottom: '1px solid lightgray' }}>
              <VariantTagInputContainer selectedTagSet={variantTagKeySet} />
            </div>
          </LabelFieldSet>

          {renderVariants(variantArray)}

          {variantInEdit && (
            <Modal
              visible={variantInEdit != null}
              title={'Edit Vendors'}
              onCancel={() => this.setState({ variantInEdit: false })}
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
