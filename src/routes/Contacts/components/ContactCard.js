import React from 'react';
import {
  Col,
  Row,
  Card,
  Popover,
  message,
  Icon,
  Popconfirm,
  Tooltip
} from 'antd';
import R from 'ramda';
import ColorList from './ColorList';
import colors from '../../../properties/cardColors';
import { updateContactById } from '../../../fireQuery/contactsQuery';
import TagList from './TagList';
import columns from '../../../properties/contactColumns';
import SearchHighlight from '../../../commonCmps/SearchHighlight';
import { stopAsyncValidation } from 'redux-form';
import { getContactVendors } from '../contactUtility';

class ContactCard extends React.Component {
  constructor(props) {
    super(props);
    this.setContactColor = this.setContactColor.bind(this);
  }

  setContactColor(colorId) {
    const { _id } = this.props.info;
    updateContactById(_id, { color: colorId }).then(r => {
      console.log('updated collor', r);
      message.success('Color Updated');
    });
  }
  render() {
    const {
      info,
      search,
      onEditClick,
      onInventoryClick,
      touchOnly,
      onRevertContact,
      completelyDeleteContact,
      tags,
      variantTags,
      vendorTags
    } = this.props;
    const { setContactColor, setHovering } = this;
    // const { name, age, email, phone, search} = props;
    const { _id, name, color = 'white', deleted = false, ...rest } = info;
    const colorObj = colors.find(c => c.id == color);

    const nameTitle = (
      <p>
        <SearchHighlight search={search} value={name} />
      </p>
    );

    const renderRow = (label, value, format = R.identity) => (
      <div key={label}>
        <p
          style={{
            fontWeight: 'bold',
            fontSize: 12,
            color: colorObj.titleColor || '#AAAAAA'
          }}
        >
          {label}
        </p>
        <span style={{ color: colorObj.font, wordWrap: 'break-word' }}>
          <SearchHighlight search={search} value={format(value)} />
        </span>
      </div>
    );

    const colorBox = (
      <div style={{ width: 200 }}>
        <ColorList
          activeColorId={info.color}
          onColorSelect={c => setContactColor(c.id)}
          colors={colors}
        />
      </div>
    );

    const extra = deleted ? (
      [
        <Tooltip title="Restore this contact">
          <Icon
            className="cursor-pointer"
            style={{ marginRight: 12 }}
            type="rollback"
            onClick={() => onRevertContact(_id)}
          />
        </Tooltip>,
        <Popconfirm
          title="Are you sure to permanently delete this contact?"
          onConfirm={() => completelyDeleteContact(_id)}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Permanently Delete">
            <Icon type="close" />
          </Tooltip>
        </Popconfirm>
      ]
    ) : (
      <span>
        {/* <Icon style={{color: colorObj.font}} type="edit" onClick={() => onEditClick(info)}/> */}
        <Popover
          placement="bottomRight"
          content={colorBox}
          trigger={touchOnly ? 'click' : 'hover'}
        >
          <span className="color-picker-wrapper">
            <span
              className="color-picker"
              style={{ backgroundColor: colorObj.font }}
            />
          </span>
        </Popover>
      </span>
    );

    return (
      <Card
        style={{ backgroundColor: colorObj.value, margin: 5 }}
        className="contact-card"
        bordered={false}
      >
        <div className="card-title">
          <div className="title-text" style={{ color: colorObj.font }}>
            <a onClick={() => onInventoryClick(info)}>{nameTitle}</a>
          </div>
          <div className="title-extra">{extra}</div>
        </div>
        <Row style={{ minHeight: 30 }} onClick={() => onEditClick(info)}>
          <Col className="card-text">
            {columns
              .filter(
                c => !c.notShow && info[c.key] != null && info[c.key] != ''
              )
              .map(c => renderRow(c.label, info[c.key], c.format))}

            {[
              { key: 'tagKeySet', label: 'Tags', source: tags },
              {
                key: 'variantTagKeySet',
                label: 'Variants',
                source: variantTags
              },
              {
                key: 'venderTagKeySet',
                keySet: getContactVendors(info).reduce(
                  (acc, cur) => ({ ...acc, [cur]: true }),
                  {}
                ),
                label: 'Vendors',
                source: vendorTags
              }
            ]
              .filter(
                config =>
                  R.is(Object, config.keySet || info[config.key]) &&
                  !R.isEmpty(config.keySet || info[config.key])
              )
              .map(config => (
                <div key={config.key} style={{ marginTop: 5 }}>
                  <div
                    style={{
                      fontWeight: 'bold',
                      fontSize: 12,
                      color: colorObj.titleColor || '#AAAAAA'
                    }}
                  >
                    {config.label}
                  </div>
                  <span
                    style={{ color: colorObj.font, wordWrap: 'break-word' }}
                  >
                    <TagList
                      color={colorObj.font}
                      tags={R.keys(config.keySet || info[config.key])
                        .map(t => config.source.find(tg => tg.key == t))
                        .filter(x => x)}
                    />
                  </span>
                </div>
              ))}
          </Col>
        </Row>
      </Card>
    );
  }
}

export default ContactCard;
