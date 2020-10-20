import React, { Component } from 'react';
import moment from 'moment';

class Time extends Component {
  renderUpdatedAt = (data, iso8601, detailed) => {
    if (!data.updatedAt) return null;

    return (
      <React.Fragment>
        <React.Fragment> (last edited </React.Fragment>
        <time title={moment(data.updatedAt).format(detailed)} dateTime={data.updatedAt}>
          {moment(data.updatedAt, iso8601).fromNow()})
        </time>
      </React.Fragment>
    );
  }

  renderCreatedAt = (data, iso8601, detailed) => {
    if (!data.createdAt) return null;

    return (
      <React.Fragment>
        <React.Fragment>Submitted </React.Fragment>
        <time title={moment(data.createdAt).format(detailed)} dateTime={data.createdAt}>
          {moment(data.createdAt, iso8601).fromNow()}
        </time>
      </React.Fragment>
    );
  }

  render() {
    const { data, shorthand = false } = this.props;
    const iso8601 = "YYYY-MM-DD hh:mm:ss Z";
    const detailed = "MMMM Do YYYY, h:mm:ss a";

    return (
      <React.Fragment>
        {this.renderCreatedAt(data, iso8601, detailed)}
        {shorthand ? "*" : this.renderUpdatedAt(data, iso8601, detailed)}
      </React.Fragment>
    );
  }
}

export default Time;