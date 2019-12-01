import React, { Component } from 'react';

class PlayerList extends Component {
  state = {}
  render() {
    return (
      <React.Fragment>
        <div style={{ cursor: "pointer" }} onClick={this.props.onClick}>Show Players</div>
      </React.Fragment>);
  }
}

export default PlayerList;