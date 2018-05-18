import React from 'react';
import { Button, Icon , message} from 'antd';
import { parsePasteText } from './pasteHistoryUtil';
import { GREEN, RED } from '../../../properties/Colors';
import { updateVendorQuantity } from '../../../fireQuery/contactsQuery';

class PasteTableContainer extends React.Component {
  state = {
    entries: null
  };

  render() {
    const { contacts, vendorTags, variantTags } = this.props;
    const { entries } = this.state;

    const renderRow = row => {
      const {
        code,
        name,
        _id,
        variantKey,
        rawVariant,
        vendorKey,
        rawVendor,
        qty,
        primary,
        secondary,
        total,
        exist,
        vendorExist,
        variantExist
      } = row;

      console.log('_id is ', _id);

      const nameSpan = name ? (
        <span>{name + _id}</span>
      ) : (
        <span className="text-danger">Not Found</span>
      );

      const variantSpan = !rawVariant ? (
        <span className="text-danger">No Variant</span>
      ) : name && variantExist ? (
        <span>{variantKey}</span>
      ) : (
        <span className="text-danger">{rawVariant}</span>
      );

      // const vendorSpan =
      //   vendorKey && vendorExist ? (
      //     <span>{vendorKey}</span>
      //   ) : (
      //     <span className="text-danger">
      //       {rawVendor && `[${rawVendor}]`} Not Found
      //     </span>
      //   );

      const vendorSpan = !rawVendor ? (
        <span className="text-danger">No Vendor</span>
      ) : vendorExist ? (<span>{vendorKey}</span>) : (
          <span className="text-danger">{rawVendor}</span>
      )


      const valid = name && variantExist && vendorExist && secondary >= qty;

      const statusSpan = valid ? (
        <Icon style={{ color: GREEN }} type="check-circle" />
      ) : (
        <Icon type="close-circle" style={{ color: RED }} />
      );

      const trClass = `table-${valid ? 'success' : 'danger'}`;

      const actionSpan = valid ? (
        <Button
          type="primary"
          size="small"
          onClick={() =>
            updateVendorQuantity({
              contactId: _id,
              variantKey,
              vendorKey,
              type: 'secondary',
              number: secondary - qty
            }).then(() => message.success('updated'))
            .then(() => this.)
          }
        >
          Update
        </Button>
      ) : (
        <span />
      );

      return (
        <tr className={trClass}>
          <td>{code}</td>
          <td>{nameSpan}</td>
          <td>{variantSpan}</td>
          <td>{vendorSpan}</td>
          <td>{qty}</td>
          <td>
            P: {primary} - S: {secondary} - T: {total}
          </td>
          <td>{statusSpan}</td>
          <td>{actionSpan}</td>
        </tr>
      );
    };

    return (
      <div>
        <input ref={input => (this.pasteInput = input)} />
        <Button
          onClick={() => {
            console.log(this.pasteInput.value);
            const r = parsePasteText(
              this.pasteInput.value,
              contacts,
              variantTags,
              vendorTags
            );
            this.setState({ entries: r });
          }}
        />

        {entries && (
          <table className="table table-sm">
            <thead>
              <th scope="col">CODE</th>
              <th scope="col" style={{ width: '30%' }}>
                Product
              </th>
              <th scope="col">Variant</th>
              <th scope="col">Vendor</th>
              <th scope="col">Qty</th>
              <th scope="col">Current Stock</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </thead>
            <tbody>{entries.map(renderRow)}</tbody>
          </table>
        )}
      </div>
    );
  }
}

export default PasteTableContainer;
