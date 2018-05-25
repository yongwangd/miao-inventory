import React, { Component } from 'react';

class ModalContainer extends Component {
  state = { visible: false };
  render() {
    const { visible } = this.state;
    const { children } = this.props;
    return children({
      visible,
      hide: () => this.setState({ visible: false }),
      show: () => this.setState({ visible: true })
    });
  }
}

export default ModalContainer;
