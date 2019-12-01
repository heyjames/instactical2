import React from 'react';
import Banner from './banner';
import Form from './form';
import Joi from 'joi-browser';

class LoginForm extends Form {
  state = {
    data: { username: "", password: "" },
    errors: {}
  }

  schema = {
    username: Joi.string()
      .required()
      .label('Username'),
    password: Joi.string()
      .required()
      .label('Password')
  };

  doSubmit = () => {
    console.log("Submitted");
  }

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
            <div className="col-md-6 offset-md-3">

              <form onSubmit={this.handleSubmit}>
                {this.renderInput("username", "Username")}
                {this.renderInput("password", "Password", "password")}
                {this.renderButton("Login")}
              </form>

            </div>
          </div>
        </div>
      </React.Fragment >
    );
  }
}

export default LoginForm;