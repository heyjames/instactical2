import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ProtectedRoute from './components/common/protectedRoute';
import Navbar from './components/homepage/navbar';
import Home from './components/home';
import Blog from './components/blog';
import BlogPost from './components/blogPost';
import Guidelines from './components/guidelines';
import About from './components/about';
import Donate from './components/donate';
import NotFound from './components/notFound';
import AboutForm from './components/aboutForm';
import GuidelineForm from './components/guidelineForm';
import AnnouncementForm from "./components/announcementForm";
import BlogPostForm from "./components/blogPostForm";
import Announcements from './components/announcements';
import { getAnnouncements, getAnnouncementsPreview } from './services/announcementService';
import { getBlogPost, getBlogPreview } from './services/blogService';
import { getServers, getServerInfo } from './services/fakeServers';
import Profile from './components/profile';
import RegisterForm from "./components/registerForm";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import auth from './services/authService';
import './App.css';

class App extends Component {
  constructor() {
    super();
    const user = auth.getCurrentUser();
    this.state = { user };
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <Navbar user={user} />
        <Switch>
          <Route path="/profile" render={(props) => <Profile {...props} user={user} />} />
          <Route path="/login" component={LoginForm} />
          <Route path="/logout" component={Logout} />
          <Route path="/register" component={RegisterForm} />
          <Route path="/announcements/:id" component={AnnouncementForm} />
          <Route path="/announcements" component={Announcements} />
          <Route path="/donate" component={Donate} />
          <ProtectedRoute path="/about/edit" component={AboutForm} />
          <Route path="/about" render={props => <About {...props} user={user} />} />
          <Route path="/guidelines/edit" component={GuidelineForm} />
          <Route path="/guidelines" component={Guidelines} />
          <Route path="/blog/new" component={BlogPostForm} />
          <Route path="/blog/post/:slug/edit" component={BlogPostForm} />
          <Route path="/blog/post/:slug" component={BlogPost} />
          <Route path="/blog" component={Blog} />
          <Route path="/notFound" component={NotFound} />
          <Route path="/" exact render={(props) => <Home
            {...props}
            announcements={getAnnouncements()}
            // announcementsPreview={getAnnouncementsPreview()}
            // blogPreview={getBlogPreview()}
            servers={getServers()} />}
          />
          <Redirect to="/notFound" />
        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
