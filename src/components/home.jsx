import React, { Component } from 'react';
import Banner from './homepage/banner';
import MainInfo from './homepage/mainInfo';
import BlogPreview from './homepage/blogPreview';
import Footer from './homepage/footer';
import { getAnnouncements } from '../services/fakeAnnouncements';

class Home extends Component {
  state = {
    announcements: []
  };

  componentDidMount() {
    this.setState({ announcements: getAnnouncements() })
  };

  render() {

    return (
      <React.Fragment>
        <Banner />
        <MainInfo announcements={this.state.announcements} />
        <BlogPreview />
        <Footer />
      </React.Fragment>
    );
  }
}

export default Home;