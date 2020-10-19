import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ProtectedRoute from './components/common/protectedRoute';
import RegisteredUserRoute from './components/common/registeredUserRoute';
import Navbar from './components/homepage/navbar';
import Home from './components/home';
import Blog from './components/blog';
import BlogPost from './components/blogPost';
import Guidelines from './components/guidelines';
import About from './components/about';
import PlayerProfileBanForm from './components/playerprofiles/playerProfileBanForm';
import PlayerProfileKickForm from './components/playerprofiles/playerProfileKickForm';
import PlayerProfile from './components/playerprofiles/playerProfile';
import PlayerProfiles from './components/playerprofiles/playerProfiles';
import Unauthorized from './components/unauthorized';
import NotFound from './components/notFound';
import AboutForm from './components/aboutForm';
import GuidelineForm from './components/guidelineForm';
import AnnouncementForm from "./components/announcementForm";
import BlogPostForm from "./components/blogPostForm";
import Announcements from './components/announcements';
import Profile from './components/profile';
// import RegisterForm from "./components/registerForm";
import LoginForm from "./components/loginForm";
import Logout from "./components/logout";
import auth from './services/authService';
import Footer from './components/homepage/footer';
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
          <RegisteredUserRoute path="/profile" render={(props) => <Profile {...props} user={user} />} />
          <Route path="/login" component={LoginForm} />
          <RegisteredUserRoute path="/logout" component={Logout} />
          {/* <Route path="/register" component={RegisterForm} /> */}
          <ProtectedRoute path="/announcements/:id" component={AnnouncementForm} />
          <Route path="/announcements" render={props => <Announcements {...props} user={user} />} />
          <ProtectedRoute path="/about/edit" component={AboutForm} />
          <Route path="/about" render={props => <About {...props} user={user} />} />
          <ProtectedRoute path="/guidelines/edit" render={props => <GuidelineForm {...props} user={user} />} />
          <Route path="/guidelines" render={props => <Guidelines {...props} user={user} />} />
          <ProtectedRoute path="/blog/new" component={BlogPostForm} />
          <ProtectedRoute path="/blog/post/:slug/edit" component={BlogPostForm} />
          <Route path="/blog/post/:slug" render={props => <BlogPost {...props} user={user} />} />
          <Route path="/blog" render={props => <Blog {...props} user={user} />} />
          <ProtectedRoute path="/playerprofiles/:steamId/ban/:index" render={props => <PlayerProfileBanForm {...props} user={user} />} />
          <ProtectedRoute path="/playerprofiles/:steamId/kick/:index" render={props => <PlayerProfileKickForm {...props} user={user} />} />
          <RegisteredUserRoute path="/playerprofiles/:steamId" render={props => <PlayerProfile {...props} user={user} />} />
          <RegisteredUserRoute path="/playerprofiles" render={props => <PlayerProfiles {...props} user={user} />} />
          <Route path="/unauthorized" component={Unauthorized} />
          <Route path="/notFound" component={NotFound} />
          <Route path="/" exact component={Home} />
          <Redirect to="/notFound" />
        </Switch>
        <Footer />
      </React.Fragment>
    );
  }
}

export default App;
