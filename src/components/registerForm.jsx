import React, { Component } from 'react';
import Banner from './banner';
import Joi from 'joi-browser';
import Form from './form';

class RegisterForm extends Form {
  state = {
    data: { username: "", password: "", name: "" },
    errors: {}
  }

  schema = {
    username: Joi.string()
      .required()
      .email()
      .label('Username'),
    password: Joi.string()
      .required()
      .min(5)
      .label('Password'),
    name: Joi.string()
      .required()
      .label('Name')
  };

  doSubmit = () => {
    // Call the server
    console.log("Submitted");
  }

  render() {
    const pageTitle = { title: "Register" };
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
                {this.renderInput("name", "Name")}
                {this.renderButton("Register")}
              </form>

            </div>
          </div>
        </div>
      </React.Fragment >
    );
  }
}

export default RegisterForm;