import { connect } from "react-redux";
import React, { Component } from "react";
import validator from "validator";
import R from "ramda";
import PropTypes from "prop-types";
import {
  Collapse,
  Button,
  message,
  Popconfirm,
  Spin,
  Table,
  Menu,
  Dropdown,
  Icon
} from "antd";
import LabelFieldSet from "../../../commonCmps/LabelFieldSet";
import simpleForm from "../../../lib/simpleForm";
// import ImageViewer from "../../../commonCmps/ImageViewer";
// import { getBusinessCardRef } from "../../../fireQuery/fireConnection";
import createUUID from "../../../lib/uuidTool";
import TagInputContainer from "../containers/TagInputContainer";
import { a } from "../contactUtility";

const { Panel } = Collapse;

const validation = () => {
  const err = {};
  // if (name.trim().length === 0) err.name = "Name cannot be blank";
  // if (!R.isEmpty(email.trim()) && !validator.isEmail(email)) {
  //   err.email = "Email is not valid";
  // }
  return err;
};

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

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
        <Menu>
          <Menu.Item>
            <a>In Stock</a>
            <a>Move to Secondary Storage</a>
            <a>Reset</a>
          </Menu.Item>
        </Menu>
      );
      return (
        <Dropdown overlay={menu}>
          <a className="ant-dropdown-link" style={{ color: "blue" }}>
            {text}
          </a>
        </Dropdown>
      );
    }
  },
  {
    title: "Secondary",
    dataIndex: "secondary",
    key: "secondary"
  }
];

@connect()
@simpleForm({
  fields: [
    "name",
    "comment",
    // "inStock",
    "tagKeySet"
    // "downloadURL",
    // "cardImageName"
  ],
  validate: validation
})
class ContactItemForm extends Component {
  state = {
    uploadLoading: false
  };

  submit = async () => {
    const { fields, isFormValid, onOk, preSubmit } = this.props;

    preSubmit();
    if (!isFormValid) {
      message.error("Information is not valid");
      return;
    }

    const toUpdate = { ...fields };

    this.setState({ uploadLoading: true });

    onOk(toUpdate);
  };

  render() {
    const { submit, props } = this;
    const {
      comment,
      hasSubmitted,
      okText = "Ok",
      cancelText = "Cancel",
      onCancel,
      isFormValid,
      showDelete,
      onDelete,
      loading = false,
      loadingText = "Loading",
      tagKeySet = {}
    } = props;
    const { uploadLoading } = this.state;

    const fieldArray = ["name"];

    const variants = [
      {
        id: "12",
        label: "12",
        vendors: [
          {
            key: "amazon",
            label: "Amazon",
            primary: 13,
            secondary: 10
          },
          {
            key: "ebay",
            label: "Ebay",
            primary: 0,
            secondary: 20
          },
          {
            key: "walmart",
            label: "Walmart",
            primary: 20,
            secondary: 0
          }
        ]
      },
      {
        id: "14",
        label: "14",
        vendors: [
          {
            key: "amazon",
            label: "Amazon",
            primary: 13,
            secondary: 10
          },
          {
            key: "walmart",
            label: "Walmart",
            primary: 20,
            secondary: 0
          }
        ]
      }
    ];

    const capitalize = str => str.slice(0, 1).toUpperCase() + str.slice(1);

    const renderField = fieldArray.map(fieldName => (
      <LabelFieldSet
        key={fieldName}
        label={capitalize(fieldName)}
        err={
          (hasSubmitted || props[fieldName].touched) && props[fieldName].error
        }
      >
        <input className="form-control" {...props[fieldName]} />
      </LabelFieldSet>
    ));

    const renderVariants = variants => {
      console.log("render");

      return (
        <Collapse bordered={false} defaultActiveKey={["1"]}>
          {variants.map(variant => (
            <Panel key={variant.id} header={variant.label}>
              <Table
                size={"small"}
                pagination={false}
                columns={variantColumns}
                dataSource={variant.vendors}
              />
            </Panel>
          ))}
        </Collapse>
      );
    };

    return (
      <Spin tip={loadingText} spinning={uploadLoading || loading}>
        <div>
          {renderField}

          <LabelFieldSet
            label="Comment"
            err={(hasSubmitted || comment.touched) && comment.error}
          >
            <textarea className="form-control" {...comment} />
          </LabelFieldSet>

          <LabelFieldSet
            label="Tags"
            err={(hasSubmitted || tagKeySet.touched) && tagKeySet.error}
          >
            <div style={{ borderBottom: "1px solid lightgray" }}>
              <TagInputContainer
                selectedTagSet={tagKeySet.value}
                onTagSetChange={keySet => tagKeySet.onChange(undefined, keySet)}
              />
            </div>
          </LabelFieldSet>

          {renderVariants(variants)}

          <Button
            style={{ marginTop: 10 }}
            type="primary"
            disabled={hasSubmitted && !isFormValid}
            onClick={submit}
          >
            {okText}
          </Button>
          <Button style={{ marginLeft: 20 }} type="default" onClick={onCancel}>
            {cancelText}
          </Button>
          {showDelete && (
            <Popconfirm
              title="Are you sure to delete this contact?"
              onConfirm={onDelete}
              onCancel={() => {}}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ float: "right" }} type="danger" ghost>
                Delete
              </Button>
            </Popconfirm>
          )}
        </div>
      </Spin>
    );
  }
}

ContactItemForm.propTypes = {
  initData: PropTypes.object,
  name: PropTypes.object,
  phone: PropTypes.object,
  email: PropTypes.object,
  address: PropTypes.object,
  company: PropTypes.object,
  website: PropTypes.object,
  instagram: PropTypes.object,
  facebook: PropTypes.object,
  comment: PropTypes.object,
  hasSubmitted: PropTypes.bool,
  okText: PropTypes.string,
  cancelText: PropTypes.string,
  onCancel: PropTypes.func,
  isFormValid: PropTypes.bool,
  showDelete: PropTypes.bool,
  onDelete: PropTypes.func,
  loading: PropTypes.bool,
  loadingText: PropTypes.string,
  tagKeySet: PropTypes.object
};

export default ContactItemForm;
