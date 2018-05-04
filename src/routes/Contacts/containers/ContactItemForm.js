import { connect } from "react-redux";
import React, { Component } from "react";
import validator from "validator";
import R from "ramda";
import PropTypes from "prop-types";
import { Collapse, Button, message, Popconfirm, Spin } from "antd";
import LabelFieldSet from "../../../commonCmps/LabelFieldSet";
import simpleForm from "../../../lib/simpleForm";
import ImageViewer from "../../../commonCmps/ImageViewer";
import { getBusinessCardRef } from "../../../fireQuery/fireConnection";
import createUUID from "../../../lib/uuidTool";
import TagInputContainer from "../containers/TagInputContainer";

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

@connect()
@simpleForm({
  fields: [
    "name",
    "comment",
    "inStock",
    "tagKeySet",
    "downloadURL",
    "cardImageName"
  ],
  validate: validation
})
class ContactItemForm extends Component {
  state = {
    cardImage: null,
    cardImageName: null,
    imageDeleted: false,
    uploadLoading: false,
    imageSrc: this.props.initData && this.props.initData.downloadURL
  };

  onFileSelect = file => {
    this.setState({
      cardImage: file,
      cardImageName: createUUID(),
      imageDeleted: false
    });
    getBase64(file, imageSrc =>
      this.setState({
        imageSrc
      })
    );
  };

  onDeleteFile = () => {
    this.setState({
      imageSrc: null,
      cardImage: null,
      cardImageName: null,
      imageDeleted: true
    });
  };

  originalImageSrc = this.state.imageSrc;
  originalImageName = this.props.initData && this.props.initData.cardImageName;

  submit = async () => {
    const { fields, isFormValid, onOk, preSubmit } = this.props;
    const { cardImage, cardImageName, imageDeleted } = this.state;
    const { originalImageName } = this;

    preSubmit();
    if (!isFormValid) {
      message.error("Information is not valid");
      return;
    }

    const toUpdate = { ...fields };

    let downloadURL = null;

    this.setState({ uploadLoading: true });

    if (imageDeleted) {
      toUpdate.cardImageName = null;
      toUpdate.downloadURL = null;
    } else if (
      cardImage &&
      cardImageName &&
      originalImageName !== cardImageName
    ) {
      const snap = await getBusinessCardRef()
        .child(cardImageName)
        .put(cardImage);
      downloadURL = snap.downloadURL;
      // contact.downloadURL = downloadURL;
      toUpdate.downloadURL = downloadURL;
      toUpdate.cardImageName = cardImageName;
    }
    this.setState({ uploadLoading: false });
    onOk(toUpdate);
  };

  render() {
    const { submit, onFileSelect, onDeleteFile, props } = this;
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
    const { imageSrc, uploadLoading } = this.state;

    const fieldArray = ["name", "comment", "inStock"];

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

          <Collapse bordered={false} defaultActiveKey={["1"]}>
            <Panel header="This is panel header 1" key="1">
              FIrst Thing
            </Panel>
            <Panel header="This is panel header 2" key="2">
              FIrst Thing
            </Panel>
            <Panel header="This is panel header 3" key="3">
              FIrst Thing
            </Panel>
          </Collapse>

          <ImageViewer
            onFileSelect={onFileSelect}
            buttonText={"Upload Business Card"}
            onDeleteFile={onDeleteFile}
            imageSrc={imageSrc}
          />
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
