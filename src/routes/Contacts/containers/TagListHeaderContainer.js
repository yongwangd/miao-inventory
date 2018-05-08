import React, { Component } from 'react';
import R from 'ramda';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tag, Modal, Tabs, message, Icon, Popconfirm, Input } from 'antd';
import TagListHeader from '../components/TagListHeader';
import { toggleArrayItem } from '../../../lib/littleFn';
import tagsQuery, {
  createContactTag,
  updateContactTagById,
  deleteContactTagById
} from '../../../fireQuery/tagsQuery';
import SimpleInputButton from '../../../commonCmps/SimpleInputButton';
import { parseTagFromLabel } from '../contactUtility';
import TagInputContainer from '../containers/TagInputContainer';
import { ContactTagInputContainer } from './TagInputContainer';

// @connect(state => ({
//   tags: state.tagChunk.tags
// }))
class TagListHeaderContainer extends Component {
  state = {
    edittingTags: false,
    edittingSingleTag: false,
    newTagName: ''
  };

  onTagClick = tag => {
    const { onActiveTagsChange, activeTagKeys } = this.props;
    onActiveTagsChange(toggleArrayItem(activeTagKeys, tag.key));
  };

  editSingleTag = tag => {
    this.setState({ edittingSingleTag: tag });
  };

  addNewTag = label => {
    const { tagsQuery } = this.props;
    const tag = parseTagFromLabel(label);
    return tagsQuery
      .createTag(tag)
      .then(() => message.success(`Tag ${tag.key} Created`));
  };

  newTagNameError = label => {
    const { tags } = this.props;
    if (tags.find(tg => (tg.label || '').trim() === label.trim())) {
      return 'Existed!';
    }
    return '';
  };

  unarchivedTag = tag => {
    this.props.tagsQuery
      .updateTagById(tag._id, { archived: false })
      .then(() => message.success(`Tag ${tag.label} restored`));
  };

  archiveTag = tag => {
    this.props.tagsQuery
      .updateTagById(tag._id, { archived: true })
      .then(() => message.success(`Tag ${tag.label} archived`));
  };

  updateTagParent = (tag, parentTagSet) => {
    this.props.tagsQuery.updateTagById(tag._id, { parentTagSet }).then(() => {
      this.setState({ edittingSingleTag: null });
      message.success('Parent tag updated!');
    });
  };

  startEdittingLabel = tag =>
    this.setState({
      tagInEdit: tag,
      tempLabel: tag.label
    });

  handleKeyPress = e => {
    if (e.key !== 'Enter') return;
    const { tagInEdit, tempLabel } = this.state;
    if (this.editErrorMsg(tagInEdit.label, tempLabel) != null) return;

    updateContactTagById(tagInEdit._id, { label: tempLabel }).then(r => {
      message.success(`Tag ${tagInEdit.label} changed to ${tempLabel}`);
      this.setState({
        tagInEdit: null,
        tempLabel: ''
      });
    });
  };

  permanentlyDeleteTag = tag => {
    const { afterTagDelete, tagsQuery } = this.props;
    return tagsQuery.deleteTagById(tag._id).then(() => afterTagDelete(tag));
  };

  editErrorMsg = (oldLabel = '', newLabel = '') => {
    const { tags } = this.props;
    if (!newLabel.trim()) return 'Cannot be blank';
    if (oldLabel.trim() === newLabel.trim()) return '';

    if (tags.find(tg => (tg.label || '').trim() === newLabel.trim())) {
      return 'Existed!';
    }
    return null;
  };

  render() {
    const {
      manageTagsText = 'Manage Tags',
      onActiveTagsChange,
      tags,
      ...rest
    } = this.props;
    const {
      edittingTags,
      tagInEdit,
      tempLabel,
      newTagName,
      edittingSingleTag
    } = this.state;
    const {
      addNewTag,
      newTagNameError,
      startEdittingLabel,
      handleKeyPress,
      editErrorMsg
    } = this;

    const renderActive = tag => (
      <div className="row" style={{ padding: 3 }}>
        <div className="col-10">
          {tagInEdit !== tag ? (
            <a onClick={() => startEdittingLabel(tag)}>{tag.label}</a>
          ) : (
            [
              <Input
                value={tempLabel}
                onKeyPress={handleKeyPress}
                onChange={e => this.setState({ tempLabel: e.target.value })}
                style={{ width: 120 }}
                suffix={
                  editErrorMsg(tag.label, tempLabel) == null && (
                    <Icon type="check" style={{ color: 'green' }} />
                  )
                }
              />,
              <a
                style={{ marginLeft: 8 }}
                onClick={() => this.setState({ tagInEdit: null })}
              >
                Cancel
              </a>,
              <span className="tag-error danger text-danger">
                {editErrorMsg(tag.label, tempLabel)}
              </span>
            ]
          )}
        </div>
        <Popconfirm
          title={`Are you sure archive ${tag.label}?`}
          onConfirm={() => this.archiveTag(tag)}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <a>Archive</a>
        </Popconfirm>
      </div>
    );

    const renderArchived = tag => (
      <div className="row" style={{ padding: 3 }}>
        <div className="col-6"> {tag.label} </div>
        <a className="col-2" onClick={() => this.unarchivedTag(tag)}>
          Restore
        </a>
        <Popconfirm
          title={`Are you sure permanently ${tag.label}? \nThe app will also delete this tag from Contacts. \nThis action is not reversable`}
          onConfirm={() => this.permanentlyDeleteTag(tag)}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <a className="col-4 text-danger">permanently Delete</a>
        </Popconfirm>
      </div>
    );

    return (
      <span>
        <TagListHeader
          {...rest}
          tags={tags.filter(tg => !tg.archived)}
          onTagClick={this.onTagClick}
          editTag={this.editSingleTag}
        />
        <Tag onClick={() => this.setState({ edittingTags: true })}>
          {manageTagsText}
        </Tag>
        {edittingSingleTag && (
          <Modal
            visible={edittingSingleTag}
            onCancel={() => this.setState({ edittingSingleTag: false })}
            onOk={() =>
              this.updateTagParent(
                edittingSingleTag,
                edittingSingleTag.parentTagSet
              )}
          >
            <span>Parent Tag</span>
            <ContactTagInputContainer
              selectedTagSet={edittingSingleTag.parentTagSet || {}}
              onTagSetChange={keySet => {
                // edittingSingleTag.parentTagSet = keySet;
                // this.setState({
                //   edittingSingleTag: {
                //     ...this.state.edittingSingleTag,
                //     parentTagSet: keySet
                //   }
                // });

                this.setState(
                  R.assocPath(
                    ['edittingSingleTag', 'parentTagSet'],
                    keySet,
                    this.state
                  )
                );
                console.log('new keyset', keySet);
              }}
            />
          </Modal>
        )}
        {edittingTags && (
          <Modal
            visible={edittingTags}
            onCancel={() => this.setState({ edittingTags: false })}
            footer={null}
          >
            <Tabs>
              <Tabs.TabPane tab="Active Tags" key="1">
                <SimpleInputButton
                  text="New Tag"
                  okLabel="Create"
                  getErrorMsg={newTagNameError}
                  onSubmit={addNewTag}
                />
                {tags.filter(tg => !tg.archived).map(renderActive)}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Archived Tags" key="2">
                {tags.filter(tg => tg.archived).map(renderArchived)}
              </Tabs.TabPane>
            </Tabs>
          </Modal>
        )}
      </span>
    );
  }
}

TagListHeaderContainer.propTypes = {
  onActiveTagsChange: PropTypes.func,
  activeTagKeys: PropTypes.array,
  afterTagDelete: PropTypes.func,
  tags: PropTypes.arrayOf(PropTypes.object)
};

export default TagListHeaderContainer;

export const ContactTagListHeaderContainer = connect(state => ({
  tags: state.tagChunk.tags,
  tagsQuery: tagsQuery('contact')
}))(TagListHeaderContainer);

export const VariantTagListHeaderContainer = connect(state => ({
  tags: state.variantTagChunk.tags,
  tagsQuery: tagsQuery('variant'),
  manageTagsText: 'Manage Variant Tags'
}))(TagListHeaderContainer);

export const VendorTagListHeaderContainer = connect(state => ({
  tags: state.vendorTagChunk.tags,
  tagsQuery: tagsQuery('vendor'),
  manageTagsText: 'Manage Vendor Tags'
}))(TagListHeaderContainer);
