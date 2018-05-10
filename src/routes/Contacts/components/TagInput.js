import React, { Component } from 'react';
import { Tag, AutoComplete, Input, message } from 'antd';
import PropTypes from 'prop-types';

class TagInput extends Component {
  state = {
    search: '',
    value: ''
  };

  handleChange = e => {
    const { tags, addNewTag } = this.props;
    if (e.key != 'Enter') return;
    const label = e.target.value.trim();
    if (tags.find(tg => tg.label == label)) {
      message.error(`Tag ${label} already exists`);
      return;
    }
    return addNewTag(label).then(() => this.setState({ search: '' }));
  };

  render() {
    const {
      tags,
      onTagSelect,
      selectedTagSet = {},
      onClose,
      closable = true
    } = this.props;
    const { search } = this.state;
    const { handleChange } = this;

    const renderTag = tag => (
      <Tag key={tag.key} closable={closable} onClose={() => onClose(tag)}>
        {tag.label}
      </Tag>
    );

    const filterTags = str =>
      tags
        .filter(
          tg =>
            tg.label &&
            !selectedTagSet[tg.key] &&
            tg.label.toLowerCase().includes(str.toLowerCase())
        )
        .map(tg => tg.label);

    return (
      <div className="tag-input-container">
        {Object.keys(selectedTagSet)
          .map(key => tags.find(tg => tg.key == key))
          .filter(tg => tg != null)
          .map(renderTag)}
        <AutoComplete
          dataSource={filterTags(search)}
          className="tag-input-box"
          value={search}
          onSearch={str => this.setState({ search: str })}
          onSelect={label => {
            this.setState({ search: '' });
            onTagSelect(tags.find(tg => tg.label === label));
          }}
        >
          <Input
            className="tag-input-box"
            style={{ borderBottom: '1px solid lightgray' }}
            value={search}
            onChange={e => this.setState({ search: e.target.value })}
            onKeyPress={handleChange}
          />
        </AutoComplete>
      </div>
    );
  }
}

TagInput.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object),
  addNewTag: PropTypes.func,
  onTagSelect: PropTypes.func,
  selectedTagSet: PropTypes.object,
  onClose: PropTypes.func
};
export default TagInput;
