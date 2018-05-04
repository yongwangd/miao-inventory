import React, { Component } from "react";
import { connect } from "react-redux";
import { message, Spin } from "antd";
import R from "ramda";
import TagInput from "../components/TagInput";
import { createContactTag } from "../../../fireQuery/tagsQuery";
import { parseTagFromLabel } from "../contactUtility";

@connect(state => ({
  tags: state.tagChunk.tags
}))
export default class TagInputContainer extends Component {
  state = {
    loading: false
  };

  onTagSelect = tag => {
    const { onTagSetChange, selectedTagSet } = this.props;
    onTagSetChange(R.assoc(tag.key, true, selectedTagSet));
  };

  onClose = tag => {
    const { onTagSetChange, selectedTagSet } = this.props;
    onTagSetChange(R.dissoc(tag.key, selectedTagSet));
  };

  addNewTag = label => {
    const { onTagSetChange, selectedTagSet } = this.props;
    if (!label) return;

    const tag = parseTagFromLabel(label);
    this.setState({
      loading: true
    });

    return createContactTag(tag)
      .then(r => {
        console.log(r);
        message.success(`${label} created`);
        // onTagChange([...activeTagKeys, tag.key])
        onTagSetChange(
          selectedTagSet[tag.key]
            ? R.dissoc(tag.key, selectedTagSet)
            : R.assoc(tag.key, true, selectedTagSet)
        );
        this.setState({
          loading: false
        });
      })
      .catch(e => {
        console.log(e);
        this.setState({
          loading: false
        });
      });
  };

  render() {
    const { tags, ...rest } = this.props;
    const { addNewTag, onTagSelect, onClose } = this;
    const { loading } = this.state;
    console.log('tags conainer', tags);

    return (
      <Spin
        spinning={loading}
        style={{
          borderBottom: "1px solid lightgray"
        }}
      >
        <TagInput
          {...rest}
          tags={tags}
          addNewTag={addNewTag}
          onTagSelect={onTagSelect}
          onClose={onClose}
        />{" "}
      </Spin>
    );
  }
}
