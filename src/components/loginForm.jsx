import React, { Component } from 'react';
import Banner from './banner';
import Form from './form';
import Joi from 'joi-browser';
import { login } from '../services/authService';

class LoginForm extends Component {
  state = {
    data: { username: "", password: "" },
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
      .label('Password')
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    // console.log(error.details);
    return error ? error.details[0].message : null;
  };

  handleSubmit = e => {
    e.preventDefault();

    // error handle here
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      const { data: jwt } = await login(data.username, data.password);
      localStorage.setItem("token", jwt);
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        let errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  }

  handleChange = ({ currentTarget: input }) => {
    let errors = this.state.errors;
    let errorMessage = this.validateProperty(input);
    errors[input.name] = errorMessage;

    let data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data, errors });
  };

  renderButton = (label) => {
    return (
      <button
        className="btn btn-success ml-2">
        {label}</button>
    )
  }

  renderInput = (name, label, type = "text") => {
    return (
      <div className="form-group">
        <label htmlFor="title">{label}</label>
        <input
          autoFocus
          className="form-control"
          name={name}
          id={name}
          type={type}
          onChange={this.handleChange}
          value={this.state[name]}
        />
        {this.state.errors[name] && <div className="alert alert-danger">{this.state.errors[name]}</div>}
      </div>
    )
  };

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