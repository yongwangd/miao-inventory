import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse, Button, message, Popconfirm, Spin } from 'antd';
import LabelFieldSet from '../../../commonCmps/LabelFieldSet';
import simpleForm from '../../../lib/simpleForm';
// import ImageViewer from "../../../commonCmps/ImageViewer";
// import { getBusinessCardRef } from "../../../fireQuery/fireConnection";
import { ContactTagInputContainer } from '../containers/TagInputContainer';

const validation = () => {
  const err = {};
  // if (name.trim().length === 0) err.name = "Name cannot be blank";
  // if (!R.isEmpty(email.trim()) && !validator.isEmail(email)) {
  //   err.email = "Email is not valid";
  // }
  return err;
};

@connect()
@simpleForm({
  fields: [
    'name',
    'code',
    'comment',
    // "inStock",
    'tagKeySet',
    'variantTagKeySet'
    // "downloadURL",
    // "cardImageName"
  ],
  validate: validation
})
class ContactItemForm extends Component {
  state = {
    uploadLoading: false,
    edittingTags: false
  };

  submit = async () => {
    const { fields, isFormValid, onOk, preSubmit } = this.props;

    preSubmit();
    if (!isFormValid) {
      message.error('Information is not valid');
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
      okText = 'Ok',
      cancelText = 'Cancel',
      onCancel,
      isFormValid,
      showDelete,
      onDelete,
      loading = false,
      loadingText = 'Loading',
      tagKeySet = {},
      variantTagKeySet = {}
    } = props;
    const { uploadLoading, edittingTags } = this.state;

    const fieldArray = ['name', 'code'];

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
            <div style={{ borderBottom: '1px solid lightgray' }}>
              <ContactTagInputContainer
                // tagQuery={tagsQuery("variant")}
                selectedTagSet={tagKeySet.value}
                onTagSetChange={keySet => tagKeySet.onChange(undefined, keySet)}
              />
            </div>
          </LabelFieldSet>

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
              <Button style={{ float: 'right' }} type="danger" ghost>
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
