import React from "react";
import { connect } from "react-redux";

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
import { VariantTagInputContainer } from "./TagInputContainer";

const { Panel } = Collapse;

const variantColumns = [
  {
    title: "Vendor",
    dataIndex: "label",
    key: "label"
  },
  {
    title: "Primary",
    dataIndex: "primary",
    key: "primary",
    render: (text, record) => {
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
    ...tagKeySet[key],
    ...tags.find(k => k.key == key)
  }));

class InventoryEditContainer extends React.Component {
  state = {};

  render() {
    const { contact, variantTags, vendorTags } = this.props;
    const { variantTagKeySet } = contact;

    const variants = getTagArray(variantTags, variantTagKeySet);
    console.log("variants", variants);

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
          {variants.map(variant => (
            <Panel key={variant.id} header={getHeader(variant)}>
              <Table
                size={"small"}
                pagination={false}
                columns={variantColumns}
                dataSource={variant.vendors}
              />
              <Button
                size="small"
                type="primary"
                style={{ marginTop: 15 }}
                onClick={() =>
                  Modal.warning({
                    title: "This is a warning message",
                    content: "some messages...some messages..."
                  })}
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
              <VariantTagInputContainer
                // tagQuery={tagsQuery("variant")}
                selectedTagSet={variantTagKeySet}
              />
            </div>
          </LabelFieldSet>

          {renderVariants(variants)}
        </div>
      </Spin>
    );
  }
}

export default connect(state => ({
  variantTags: state.variantTagChunk.tags,
  vendorTags: state.vendorTagChunk.tags
}))(InventoryEditContainer);
