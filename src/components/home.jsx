import React, { Component } from 'react';
import Banner from './banner';
import MainInfo from './homepage/mainInfo';
import BlogPreview from './homepage/blogPreview';
import Footer from './homepage/footer';

class Home extends Component {
  render() {
    const { servers, blogPreview, announcements, announcementsPreview, featuredPost } = this.props;
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
        <MainInfo servers={servers} announcements={announcements} announcementsPreview={announcementsPreview} />
        <BlogPreview />
        <Footer />
      </React.Fragment>
    );
  }
}

export default Home;