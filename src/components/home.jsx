import React, { Component } from 'react';
import Banner from './homepage/banner';
import MainInfo from './homepage/mainInfo';
import BlogPreview from './homepage/blogPreview';
import Footer from './homepage/footer';

class Home extends Component {
  render() {
    const { servers, blogPosts, announcements, featuredPost } = this.props;
    const pageTitle = { title: "An Insurgency: Sandstorm Tactical Community", subtitle: "Less rushing. More co-op." };
    return (
      <React.Fragment>
        <Banner info={pageTitle} />
        <MainInfo servers={servers} blogPosts={blogPosts} announcements={announcements} featuredPost={featuredPost} />
        <BlogPreview blogPosts={blogPosts} />
        <Footer />
      </React.Fragment>
    );
  }
}

export default Home;