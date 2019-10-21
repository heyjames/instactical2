import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import Navbar from './components/homepage/navbar';
import Home from './components/home';
import Blog from './components/blog';
import Guidelines from './components/guidelines';
import About from './components/about';
import Donate from './components/donate';
import NotFound from './components/notFound';
import Announcements from './components/announcements';
// import logo from './logo.svg';

function App() {
  return (
    <React.Fragment>
      <Navbar />
      <Switch>
        <Route path="/announcements" component={Announcements} />
        <Route path="/donate" component={Donate} />
        <Route path="/about" component={About} />
        <Route path="/guidelines" component={Guidelines} />
        <Route path="/blog" component={Blog} />
        <Route path="/notFound" component={NotFound} />
        <Route path="/" exact component={Home} />
        <Redirect to="/notFound" />
      </Switch>
    </React.Fragment>
  );
}

export default App;
