import React, { Component } from 'react';
import '../../css/navbar.css';
import { NavLink, Link } from 'react-router-dom';

class Navbar extends Component {
  state = {
    navCollapsed: true
  }

  _onToggleNav = () => {
    this.setState({ navCollapsed: !this.state.navCollapsed });
  }
  
  render() {
    const { user } = this.props;
    const { navCollapsed } = this.state

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-lg custom-toggler">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <img src="./logo.png" width="203" height="28" className="d-inline-block align-top" alt="" />
            </Link>
            <button
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              className='navbar-toggler collapsed '
              onClick={this._onToggleNav}
              
            >
              <span class="text-light"><i class="fa fa-bars fa-1x"></i></span>
            </button>

            <div
              className={(navCollapsed ? 'collapse' : '') + ' navbar-collapse'}
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mr-auto">
                <NavLink className="nav-link" to="/">Home <span className="sr-only">(current)</span></NavLink>
                <NavLink className="nav-link" to="/blog">Blog</NavLink>
                <NavLink className="nav-link" to="/guidelines">Guidelines</NavLink>
                <NavLink className="nav-link" to="/about">About</NavLink>
                <a className="nav-link text-nowrap" target="_blank" rel="noopener noreferrer" href="https://steamcommunity.com/groups/instactical">Steam Group <i className="fa fa-external-link" aria-hidden="true"></i></a>
                {user && <NavLink className="nav-link text-nowrap" to="/playerprofiles">Player Profiles</NavLink>}
                {/* <NavLink className="nav-link" to="/donate">Donate</NavLink> */}
              </ul>
              <ul className="navbar-nav">
                {
                  !user &&
                  <React.Fragment>
                    <NavLink className="nav-link" to="/login">Login</NavLink>
                    {/* <NavLink className="nav-link" to="/register">Register</NavLink> */}
                  </React.Fragment>
                }
                {
                  user &&
                  <React.Fragment>
                    <NavLink className="nav-link text-nowrap" to="/profile"><i className="fa fa-user" aria-hidden="true"></i> Profile</NavLink>
                    <NavLink className="nav-link" to="/logout">Logout</NavLink>
                    {/* <li className="nav-item dropdown">
                      <a className="nav-link dropdown-toggle" href="#a" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Admin
                      </a>
                      <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a className="dropdown-item" href="#a">Action</a>
                        <a className="dropdown-item" href="#a">Another action</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#a">Something else here</a>
                      </div>
                    </li> */}
                  </React.Fragment>
                }
              </ul>
            </div>
          </div>
        </nav>
      </React.Fragment >
    );
  }
}

export default Navbar;