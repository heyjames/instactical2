import React, { Component } from 'react';
import Banner from './banner';

class LoginForm extends Component {
  render() {
    const pageTitle = { title: "Login" };
    const jumbotronStyle = {
      backgroundColor: "#dc3545",
      padding: "2rem 1rem"
    };
    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              Login

            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LoginForm;