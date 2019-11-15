import React, { Component } from 'react';

class Banner extends Component {
  renderSubtitle = (info) => {
    if (info.subtitle) return <p className="lead">{info.subtitle}</p>
  }

  render() {
    const { info, style: jumbotronStyle } = this.props;
    return (
      <div className="jumbotron jumbotron-fluid" style={jumbotronStyle}>
        <div className="container text-light">
          <h2 className="display-6">{info.title}</h2>
          {this.renderSubtitle(info)}
        </div>
      </div>
    );
  }
}

export default Banner;