import React from "react";
import { connect } from "react-redux";
import R from "ramda";

import {
  Modal,
  Button,
  Spin,
  Table,
  Collapse,
  InputNumber,
  Popover,
  message,
  Icon
} from "antd";
import LabelFieldSet from "../../../commonCmps/LabelFieldSet";
import {
  VariantTagInputContainer,
  VendorTagInputContainer
} from "./TagInputContainer";
import { updateContactVariantVendors } from "../../../fireQuery/contactsQuery";

const { Panel } = Collapse;

const variantColumns = [
  {
    title: "Vendor",
    dataIndex: "vendorKey",
    key: "label"
  },
  {
    title: "Primary",
    dataIndex: "primary",
    key: "primary",
    render: (text = 0, record) => {
      const menu = (
        <div>
          <div>
            <a onClick={() => message.info("In Stock")}>New Arrivals: </a>
            <InputNumber min={0} defaultValue={0} />
          </div>

          <a onClick={() => message.info("In Move to S")}>
            Move to Secondary Storage
          </a>
          <a>Reset</a>
        </div>
      );
      return (
        <Popover content={menu} title="Actions">
          <a className="ant-dropdown-link" style={{ color: "blue" }}>
            {text}
          </a>
        </Popover>
      );
    }
  },
  {
    title: "Secondary",
    dataIndex: "secondary",
    key: "secondary"
  },
  {
    title: "Actions",
    key: "action",
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
    variantInEdit: null
  };

  render() {
    const { variantInEdit } = this.state;
    const { contact, variantTags, vendorTags } = this.props;
    const { variantTagKeySet } = contact;

    // const variants = getTagArray(variantTags, variantTagKeySet);
    const variantArray = Object.keys(variantTagKeySet).map(key => ({
      ...variantTags.find(k => k.key == key),
      vendors: variantTagKeySet[key]
    }));

    console.log("variant array", variantArray);
    console.log("vendors", vendorTags);
    // const getVendorArray = vendorKeySet =>
    //   getTagArray(vendorTags, vendorKeySet);

    // const getVendorArray = vendorKeySet => {
    //   if (!R.is(Object, vendorKeySet)) {
    //     vendorKeySet = {};
    //   }
    //   return Object.keys(vendorKeySet).map(key => ({
    //     ...vendorTags.find(k => k.key == key),
    //     value: vendorKeySet[key].vendors
    //   }));
    // };

    // const getVendorArray = variantArrayItem => {
    //   Object.keys(R.is(Object, variantArrayItem.vendors) ? variantArrayItem.vendors : {} )
    //     .map(key => ({

    //   }))
    // }

    console.log("variants", variantArray);

    const renderVariants = variants => {
      console.log("render");

      const getHeader = variant => (
        <div>
          <span>{variant.label}</span>
          <span style={{ float: "right" }}>
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
        <Collapse bordered={false} defaultActiveKey={["1"]}>
          {variantArray.map(variant => (
            <Panel key={variant.id} header={getHeader(variant)}>
              <Table
                size={"small"}
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
                onClick={() => this.setState({ variantInEdit: variant })}
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
          <LabelFieldSet label="VariantTags">
            <div style={{ borderBottom: "1px solid lightgray" }}>
              <VariantTagInputContainer selectedTagSet={variantTagKeySet} />
            </div>
          </LabelFieldSet>

          {renderVariants(variantArray)}

          {variantInEdit && (
            <Modal
              visible={variantInEdit != null}
              title={"Edit Vendors"}
              onCancel={() => this.setState({ variantInEdit: false })}
            >
              <VendorTagInputContainer
                selectedTagSet={Object.keys(variantInEdit.vendors || {})}
                onTagSetChange={keySet => {
                  console.log(keySet);
                  const diff = R.difference(
                    Object.keys(keySet),
                    Object.keys(variantInEdit.vendors || {})
                  );
                  console.log("diff", diff);
                  updateContactVariantVendors(contact._id, variantInEdit.key, {
                    ...variantInEdit.vendors,
                    ...diff.reduce((acc, cur) => ({ ...acc, [cur]: true }), {})
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

export default connect(state => ({
  variantTags: state.variantTagChunk.tags,
  vendorTags: state.vendorTagChunk.tags
}))(InventoryEditContainer);
