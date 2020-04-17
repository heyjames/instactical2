import React, { Component } from 'react';
import Banner from './banner';
import MainInfo from './homepage/mainInfo';
import BlogPreview from './homepage/blogPreview';

class Home extends Component {
  render() {
    const { servers } = this.props;
    const pageTitle = {
      title: "An Insurgency: Sandstorm Tactical Community",
      subtitle: "Less rushing. More co-op."
    };
    const jumbotronStyle = {
      backgroundColor: "#99392a",
      marginBottom: "0",
      padding: "2rem 1rem"
    };

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <MainInfo servers={servers} />
        <BlogPreview />
      </React.Fragment>
    );
  }
}

export default Home;