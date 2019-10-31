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
import { getAnnouncements } from './services/fakeAnnouncements';
import { getBlogPosts } from './services/fakeBlogPosts';
import { getServers } from './services/fakeServers';
import { getFeaturedPost } from './services/fakeBlogPosts';
// import logo from './logo.svg';

class App extends Component {
  state = {}

  bannerTitles = [{ Title: "An Insur...", subtitle: "Less rushing..." }];
  render() {
    return (
      <React.Fragment>
        <Navbar />
        <Switch>
          <Route path="/announcements" component={Announcements} />
          <Route path="/donate" component={Donate} />
          <Route path="/about" component={About} />
          <Route path="/guidelines" component={Guidelines} />
          <Route path="/blog/post/:slug" component={BlogPost} />
          <Route path="/blog" component={Blog} />
          <Route path="/notFound" component={NotFound} />
          <Route path="/" exact render={() => <Home announcements={getAnnouncements()} blogPosts={getBlogPosts()} servers={getServers()} featuredPost={getFeaturedPost()} />} />
          <Redirect to="/notFound" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
