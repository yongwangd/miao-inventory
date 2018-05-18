import React from 'react';
import { Button } from 'antd';
import { parsePasteText } from './pasteHistoryUtil';

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
        variantKey,
        vendorKey,
        qty,
        primary,
        secondary,
        total,
        exist,
        vendorExist,
        variantExist
      } = row;

      const nameSpan = name ? (
        <span>{name}</span>
      ) : (
        <span className="text-danger">Not Found</span>
      );

      const variantSpan = variantExist ? (
        <span>{variantKey}</span>
      ) : (
        <span className="text-danger">
          {variantKey} Not Found on {code}
        </span>
      );

      return (
        <tr>
          <td>{code}</td>
          <td>{nameSpan}</td>
          <td>{variantSpan}</td>
          <td>{vendorKey}</td>
          <td>{qty}</td>
          <td>
            P: {primary} - S: {secondary} - T: {total}
          </td>
          <td>UnNown</td>
          <td>Action</td>
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
