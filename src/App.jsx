import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Navbar from './components/homepage/navbar';
import Home from './components/home';
import Blog from './components/blog';
import BlogPost from './components/blogPost';
import Guidelines from './components/guidelines';
import About from './components/about';
import Donate from './components/donate';
import NotFound from './components/notFound';
import Announcements from './components/announcements';
import { getAnnouncements, getAnnouncementsPreview } from './services/fakeAnnouncements';
import { getBlogPosts, getBlogPost, getBlogPreview } from './services/fakeBlogPosts';
import { getServers } from './services/fakeServers';
import { getFeaturedPost } from './services/fakeBlogPosts';
import ScrollToTop from './components/scrollToTop';
// import logo from './logo.svg';

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Navbar />
        {/* <ScrollToTop /> */}
        <Switch>
          <Route path="/announcements" render={() => <Announcements announcements={getAnnouncements()} />} />
          <Route path="/donate" component={Donate} />
          <Route path="/about" component={About} />
          <Route path="/guidelines" component={Guidelines} />
          <Route path="/blog/post/:slug" render={(props) => <BlogPost
            {...props}
            blogPost={getBlogPost()} />}
          />
          <Route path="/blog" component={Blog} />
          <Route path="/notFound" component={NotFound} />
          <Route path="/" exact render={() => <Home
            announcements={getAnnouncements()}
            announcementsPreview={getAnnouncementsPreview()}
            blogPreview={getBlogPreview()}
            servers={getServers()}
            featuredPost={getFeaturedPost()} />}
          />
          <Redirect to="/notFound" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
