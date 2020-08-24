import React, { Component } from 'react';
import Banner from './banner';
import MainInfo from './homepage/mainInfo';
import BlogPreview from './homepage/blogPreview';

class Home extends Component {
  componentDidMount() {
    document.title = "insTactical";
  }

  getPageStyles = () => {
    const pageStyles = {};

    pageStyles.bannerStyle = {
      backgroundColor: "#99392a",
      marginBottom: "0",
      padding: "2rem 1rem"
    };

    return pageStyles;
  }

  getBannerInfo = () => {
    return {
      title: "An Insurgency: Sandstorm Tactical Community",
      subtitle: "Less rushing. More co-op."
    };
  }

  render() {
    const { bannerStyle } = this.getPageStyles();
    const bannerInfo = this.getBannerInfo();

    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <MainInfo />
        <BlogPreview />
      </React.Fragment>
    );
  }
}

export default Home;