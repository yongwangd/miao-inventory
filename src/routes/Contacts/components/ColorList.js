import React, { Component } from "react";
import PropTypes from "prop-types";

class ColorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverColorId: null
    };
  }

  render() {
    const {
      colors,
      activeColorId,
      onColorSelect,
      activeColorIds = [],
      touchOnly
    } = this.props;
    const { hoverColorId } = this.state;
    const isColorActive = color =>
      color.id == activeColorId ||
      (!touchOnly && color.id == hoverColorId) ||
      activeColorIds.includes(color.id);

    const renderColor = color => (
      <span
        role="presentation"
        key={color.id}
        style={
          isColorActive(color) ? { border: `2px solid ${color.value}` } : {}
        }
        className="color-box-wrapper"
        onClick={() => onColorSelect(color)}
        onMouseEnter={() => this.setState({ hoverColorId: color.id })}
        onMouseLeave={() => this.setState({ hoverColorId: null })}
      >
        <span
          className="color-box"
          style={{
            backgroundColor: color.value,
            border: `1px solid ${color.borderColor}` || color.color
          }}
        />
      </span>
    );

    return (
      <span className="color-list-container">{colors.map(renderColor)}</span>
    );
  }
}

ColorList.propTypes = {
  colors: PropTypes.array.isRequired,
  activeColorId: PropTypes.string,
  onColorSelect: PropTypes.func.isRequired,
  activeColorIds: PropTypes.array,
  touchOnly: PropTypes.bool
};

export default ColorList;
