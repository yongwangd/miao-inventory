import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tag, Input, Modal, Button, message, Icon, Tooltip, Spin } from 'antd';
import R from 'ramda';
import { propContains, toggleArrayItem } from '../../../lib/littleFn';
import { getBusinessCardRef } from '../../../fireQuery/fireConnection';
import ContactItemForm from './ContactItemForm';
import {
  createContact,
  updateContactById,
  deleteContactById
} from '../../../fireQuery/contactsQuery';
import cardColors from '../../../properties/cardColors';
import '../../../styles/bricklayer.scss';
import ColorList from '../components/ColorList';
import TagListHeaderContainer, {
  VariantTagListHeaderContainer,
  VendorTagListHeaderContainer
} from '../containers/TagListHeaderContainer';
import columns from '../../../properties/contactColumns';
import EventLogContainer from '../../EventLog/components/EventLogContainer';
import ContactList from '../components/ContactList';
import contactColumns from '../../../properties/contactColumns';
import {
  ContactTagInputContainer,
  VendorTagInputContainer
} from './TagInputContainer';
import { ContactTagListHeaderContainer } from './TagListHeaderContainer';
import InventoryEditContainer from './InventoryEditContainer';
import {
  exportContactInventory,
  exportContactSummary,
  exportContactByVendor,
  getContactVendors,
  exportContactByMultipleVendors,
  addInventoryValidForContact
} from '../contactUtility';
import { parsePasteText } from './pasteHistoryUtil';
import PasteTableContainer from './PasteTableContainer';

@connect(state => ({
  contacts: state.contactChunk.contacts,
  touchOnly: state.env.touchOnly,
  tags: state.tagChunk.tags,
  variantTags: state.variantTagChunk.tags,
  vendorTags: state.vendorTagChunk.tags,
  dataLoading:
    state.contactChunk.initialLoading || state.tagChunk.initialLoading
}))
class ContactListContainer extends Component {
  state = {
    searchKey: '',
    visible: false,
    contactInEdit: null,
    contactInventoryInEdit: null,
    showTrafficModal: false,
    inNewMode: false,
    showEventLogModal: false,
    showEmailTextArea: false,
    showPhoneTextArea: false,
    showOnlyDeleted: false,
    showInventoryInvalid: false,
    modalLoading: false,
    activeColorIds: [],
    activeTagKeys: [],
    activeVariantTagKeys: [],
    activeVendorTagKeys: [],
    showTagContainer: false,
    showPrintVendorModal: false,
    vendorTagSetToExport: {},
    showImportTransactionModal: false
  };

  onSearchChange = evt =>
    this.setState({
      searchKey: evt.target.value
    });

  onModalCancel = () =>
    this.setState({
      contactInEdit: null,
      inNewMode: false
    });

  newContactClick = () =>
    this.setState({
      contactInEdit: null,
      inNewMode: true
    });

  updateContact = async contact => {
    this.setState({ modalLoading: true });
    const { _id } = this.state.contactInEdit;
    await updateContactById(_id, contact);
    message.success('Contact Updated');

    this.setState({
      contactInEdit: null,
      inNewMode: false,
      modalLoading: false
    });
  };

  openContactDialog = ct =>
    this.setState({
      contactInEdit: ct,
      inNewMode: false
    });

  openInventoryDialog = ct =>
    this.setState({
      contactInventoryInEdit: ct,
      inNewMode: false,
      contactInEdit: null
    });

  createNewContact = async ct => {
    const contact = { ...ct };
    const { activeColorIds, activeTagKeys } = this.state;
    this.setState({ modalLoading: true });
    let downloadURL = null;
    if (contact.cardImage && contact.cardImageName) {
      const snap = await getBusinessCardRef()
        .child(contact.cardImageName)
        .put(contact.cardImage);
      downloadURL = snap.downloadURL;
    }

    const addDownloadUrl = R.when(
      R.always(downloadURL),
      R.assoc('downloadUrl', downloadURL)
    );

    const addColor = R.when(
      R.always(R.length(activeColorIds) === 1),
      R.assoc('color', R.head(activeColorIds))
    );

    const addTags = R.when(
      R.both(
        R.always(R.length(activeTagKeys) > 0),
        R.compose(R.either(R.isNil, R.isEmpty), R.prop('tagKeySet'))
      ),
      R.assoc(
        'tagKeySet',
        R.reduce((acc, cur) => ({ ...acc, [cur]: true }), {}, activeTagKeys)
      )
    );

    const newContact = R.pipe(addDownloadUrl, addColor, addTags)(contact);

    await createContact(newContact);
    message.success('Contact Created');

    this.setState({
      inNewMode: false,
      modalLoading: false
    });
  };

  completeEdit = (promise, successMsg) =>
    promise
      .then(() => {
        message.success(successMsg);
        this.setState({
          contactInEdit: null
        });
      })
      .catch(err => {
        message.error(err);
      });

  completelyDeleteContact = _id =>
    this.completeEdit(
      deleteContactById(_id),
      `Contact ${name} Deleted Permanently`
    );

  deleteContact = () => {
    const { _id, name } = this.state.contactInEdit;
    this.completeEdit(
      updateContactById(_id, { deleted: true }),
      `Contact ${name} Moved to Trash`
    );
  };

  revertContact = _id =>
    this.completeEdit(
      updateContactById(_id, { deleted: false }),
      `Contact ${name} Restored`
    );

  deleteTagFromContacts = () => {};

  toggleColor = color => {
    const colorId = color.id;
    const { activeColorIds } = this.state;
    this.setState({
      activeColorIds: toggleArrayItem(activeColorIds, colorId)
    });
  };

  exportContacts = contacts => {
    const columnKeys = R.pluck('key')(columns);
    let csv = `${columnKeys.join(',')},tags\n`;
    csv += contacts
      .map(ct => {
        let str = columnKeys
          .map(key => ct[key] || '')
          .map(
            key => (key.includes(',') || key.includes('.') ? `"${key}"` : key)
          )
          .join(',');
        if (ct.tagKeySet) {
          str += `,${R.keys(ct.tagKeySet)
            .map(k => `@${k}`)
            .join(' ')}`;
        }
        return str;
      })
      .join('\n');
    const filename = 'products.csv';
    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }
    const data = encodeURI(csv);

    const link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', filename);
    link.click();
  };

  render() {
    const {
      onSearchChange,
      onModalCancel,
      updateContact,
      openContactDialog,
      openInventoryDialog,
      newContactClick,
      createNewContact,
      deleteContact,
      toggleColor,
      revertContact,
      completelyDeleteContact,
      deleteTagFromContacts
    } = this;

    const {
      contacts = [],
      touchOnly = false,
      tags = [],
      variantTags = [],
      vendorTags = [],
      dataLoading
    } = this.props;

    const {
      searchKey,
      contactInEdit,
      contactInventoryInEdit,
      inNewMode,
      showEmailTextArea,
      activeColorIds,
      modalLoading,
      showOnlyDeleted,
      showInventoryInvalid,
      showPhoneTextArea,
      activeTagKeys,
      activeVariantTagKeys,
      activeVendorTagKeys,
      showEventLogModal,
      showTrafficModal,
      showTagContainer,
      showPrintVendorModal,
      vendorTagSetToExport,
      showImportTransactionModal
    } = this.state;

    const visibleContacts = contacts.filter(
      c =>
        !showOnlyDeleted === !c.deleted &&
        (!showInventoryInvalid ||
          showInventoryInvalid === !c.$_inventoryValid) &&
        propContains(searchKey, contactColumns.map(col => col.key))(c) &&
        (R.isEmpty(activeColorIds) ||
          activeColorIds.includes(c.color || 'white')) &&
        (R.isEmpty(activeTagKeys) ||
          R.all(key => (c.tagKeySet || {})[key], activeTagKeys)) &&
        (R.isEmpty(activeVariantTagKeys) ||
          R.all(
            key => (c.variantTagKeySet || {})[key],
            activeVariantTagKeys
          )) &&
        (R.isEmpty(activeVendorTagKeys) ||
          R.intersection(
            activeVendorTagKeys,
            getContactVendors(c)
            // R.compose(
            //   R.uniq,
            //   R.flatten,
            //   R.map(R.keys),
            //   R.values,
            //   R.prop('variantTagKeySet')
            // )(c)
          ).length == activeVendorTagKeys.length)
    );

    return (
      <Spin spinning={dataLoading} size="large" tip="Loading Contacts">
        <div className="row">
          {/* <Tag onClick={() => this.setState({ showEventModal: true })}>
            Log</Tag> */}
          <div style={{ width: '100%', marginBottom: 10 }}>
            <Tag color="pink">{visibleContacts.length} Products</Tag>
            {!showInventoryInvalid && (
              <Tag
                color="#f50"
                onClick={() => this.setState({ showInventoryInvalid: true })}
              >
                {visibleContacts.filter(c => !c.$_inventoryValid).length}{' '}
                Products LOW Inventory
              </Tag>
            )}
            {showInventoryInvalid && (
              <Tag
                color="#f50"
                onClick={() => this.setState({ showInventoryInvalid: false })}
              >
                Show ALL
              </Tag>
            )}
            {showTagContainer && (
              <Button
                onClick={() => this.setState({ showTagContainer: false })}
                size="small"
              >
                Hide Tags
              </Button>
            )}
            {!showTagContainer && (
              <Button
                onClick={() => this.setState({ showTagContainer: true })}
                size="small"
              >
                Show Tags
              </Button>
            )}
            {showTagContainer && (
              <ContactTagListHeaderContainer
                afterTagDelete={tag => deleteTagFromContacts(tag)}
                activeTagKeys={activeTagKeys}
                onActiveTagsChange={keys =>
                  this.setState({ activeTagKeys: keys })}
                // tags={tags}
              />
            )}
            <div />
            <div />
            <VariantTagListHeaderContainer
              color={'orange'}
              activeColor={'magenta'}
              afterTagDelete={tag => deleteTagFromContacts(tag)}
              activeTagKeys={activeVariantTagKeys}
              onActiveTagsChange={keys =>
                this.setState({ activeVariantTagKeys: keys })}
              // tags={tags}
            />
            <div />
            <VendorTagListHeaderContainer
              color={'purple'}
              activeColor={'#2db7f5'}
              afterTagDelete={tag => deleteTagFromContacts(tag)}
              activeTagKeys={activeVendorTagKeys}
              onActiveTagsChange={keys =>
                this.setState({ activeVendorTagKeys: keys })}
              // tags={tags}
            />

            <Tag
              onClick={() =>
                this.setState({
                  showPrintVendorModal: true,
                  vendorTagSetToExport: []
                })}
            >
              Export by Vendor
            </Tag>

            {showPrintVendorModal && (
              <Modal
                title="Export Inventory by Vendor"
                visible={showPrintVendorModal}
                onCancel={() => this.setState({ showPrintVendorModal: false })}
                okText="Export"
                cancelText="Cancel"
                onOk={() => {
                  console.log('hello');
                  exportContactByMultipleVendors(
                    visibleContacts,
                    R.keys(vendorTagSetToExport)
                  );
                  this.setState({
                    showPrintVendorModal: false,
                    vendorTagSetToExport: []
                  });
                }}
              >
                <VendorTagInputContainer
                  allowAddNewTag={false}
                  selectedTagSet={vendorTagSetToExport}
                  onTagSetChange={keySet =>
                    this.setState({ vendorTagSetToExport: keySet })}
                />
              </Modal>
            )}
          </div>

          <Icon
            type="cloud-upload-o"
            className="fn-icon"
            onClick={() => this.setState({ showImportTransactionModal: true })}
          />
          {showImportTransactionModal && (
            <Modal
              className="paste-modal"
              title="Paste History (Please Export Inventory Data first!)"
              visible={showImportTransactionModal}
              onCancel={() =>
                this.setState({ showImportTransactionModal: false })}
              okText="Proceed"
              footer={null}
            >
              <div>
                <PasteTableContainer
                  {...{ contacts, variantTags, vendorTags }}
                />
              </div>
            </Modal>
          )}

          {showInventoryInvalid ? (
            <Icon
              type="exclamation-circle-o"
              className="fn-icon"
              onClick={() =>
                this.setState({
                  showInventoryInvalid: false
                })}
            />
          ) : (
            <Icon
              type="exclamation-circle-o"
              className="fn-icon"
              onClick={() =>
                this.setState({
                  showInventoryInvalid: true
                })}
            />
          )}

          {showOnlyDeleted ? (
            <Tooltip title="Show Active Contacts">
              <Icon
                type="desktop"
                className="fn-icon"
                onClick={() => this.setState({ showOnlyDeleted: false })}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Show Deleted Contacts">
              <Icon
                type="delete"
                className="fn-icon"
                onClick={() => this.setState({ showOnlyDeleted: true })}
              />
            </Tooltip>
          )}
          <Tooltip title="Export Product Summary">
            <Icon
              type="download"
              className="fn-icon"
              onClick={() => exportContactSummary(visibleContacts)}
            />
          </Tooltip>
          <Tooltip title="Export Inventory">
            <Icon
              type="bar-chart"
              className="fn-icon"
              onClick={() => exportContactInventory(visibleContacts)}
            />
          </Tooltip>
          <Input
            placeholder="Search"
            className="col-4 col-xs-6"
            onChange={onSearchChange}
            style={{ marginLeft: 10 }}
          />
          <Button
            style={{ marginLeft: 20 }}
            type="primary"
            icon="plus"
            onClick={newContactClick}
          >
            New
          </Button>
          <p />

          <div>
            <ColorList
              touchOnly={touchOnly}
              colors={cardColors}
              onColorSelect={toggleColor}
              activeColorIds={activeColorIds}
            />
          </div>
          {!R.isEmpty(activeColorIds) && (
            <Icon
              className="fn-icon"
              type="close"
              onClick={() => this.setState({ activeColorIds: [] })}
            />
          )}
          {showEmailTextArea && (
            <textarea
              style={{ width: '100%' }}
              value={visibleContacts
                .filter(c => c.email)
                .map(c => c.email)
                .join('; ')}
            />
          )}
          {showPhoneTextArea && (
            <textarea
              style={{ width: '100%' }}
              value={visibleContacts
                .filter(c => c.phone)
                .map(c => c.phone)
                .join('; ')}
            />
          )}

          <ContactList
            tags={tags}
            variantTags={variantTags}
            vendorTags={vendorTags}
            touchOnly={touchOnly}
            search={searchKey}
            contacts={visibleContacts}
            onEditClick={openContactDialog}
            onInventoryClick={openInventoryDialog}
            onRevertContact={revertContact}
            completelyDeleteContact={completelyDeleteContact}
          />

          {showTrafficModal && (
            <Modal
              title={'Traffic to Home'}
              visible={showTrafficModal}
              footer={null}
              width="640"
              onCancel={() => this.setState({ showTrafficModal: false })}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d105883.51706200307!2d-84.35317492387183!3d33.97044007941706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e6!4m5!1s0x88f5a6cd50cafac7%3A0xab7849cc6cc913f3!2sehair+norcross!3m2!1d33.927147!2d-84.217669!4m5!1s0x88f574ea5a5ef381%3A0xc9e2b7a72191d06b!2s2505+Timbercreek+Circle%2C+Roswell%2C+GA!3m2!1d34.047036399999996!2d-84.3299858!5e0!3m2!1sen!2sus!4v1505239889502"
                width="600"
                height="450"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen
              />
            </Modal>
          )}

          {contactInEdit && (
            <Modal
              title={`Edit ${contactInEdit.name}`}
              visible={contactInEdit != null}
              footer={null}
              onCancel={onModalCancel}
            >
              <ContactItemForm
                loading={modalLoading}
                loadingText={'Updating'}
                onOk={updateContact}
                onCancel={onModalCancel}
                okText="Update"
                showDelete
                onDelete={deleteContact}
                initData={contactInEdit}
                contact={contactInEdit}
              />
            </Modal>
          )}

          {contactInventoryInEdit && (
            <Modal
              width={700}
              title={`Edit Inventory for ${contactInventoryInEdit.name}`}
              visible={contactInventoryInEdit != null}
              footer={null}
              onCancel={() => this.setState({ contactInventoryInEdit: null })}
            >
              <InventoryEditContainer contactId={contactInventoryInEdit._id} />
            </Modal>
          )}

          {showEventLogModal && (
            <Modal
              visible={showEventLogModal}
              footer={null}
              onCancel={() => this.setState({ showEventLogModal: false })}
            >
              <EventLogContainer />
              <EventLogContainer />
              <EventLogContainer />
              <EventLogContainer />
            </Modal>
          )}
          {inNewMode && (
            <Modal
              title={'Create New Contact '}
              visible={inNewMode}
              footer={null}
              onCancel={onModalCancel}
            >
              <ContactItemForm
                loading={modalLoading}
                loadingText={'Creating'}
                onOk={createNewContact}
                onCancel={onModalCancel}
                okText="Create"
              />
            </Modal>
          )}
        </div>
      </Spin>
    );
  }
}

ContactListContainer.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.object),
  touchOnly: PropTypes.object,
  tags: PropTypes.arrayOf(PropTypes.object),
  dataLoading: PropTypes.bool
};

export default ContactListContainer;
