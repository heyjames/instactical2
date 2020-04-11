import React, { Component } from 'react';
import { getAbout, saveAbout } from '../services/aboutService';
import Banner from './banner';
import Form from './form';
import Joi from 'joi-browser';
import Input from './input';

class AboutForm extends Form {
  state = { data: { _id: "", title: "", content: "" }, errors: {} };

  async componentDidMount() {
    try {
      const { data } = await getAbout();
      const { _id, title, content } = data[0];

      this.setState({ data: { _id, title, content } });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  schema = {
    _id: Joi.string().min(1).max(50),
    title: Joi.string().min(1).max(5).required().label("Title"),
    content: Joi.string().min(2).required().label("Content")
  }

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

    return error && error.details[0].message;
  }

  handleChange = ({ currentTarget: input }) => {
    let obj = { ...this.state }
    const errorMsg = this.validateProperty(input);
    obj.errors[input.name] = errorMsg;
    obj.data[input.name] = input.value;

    this.setState(obj);
  }

  handleCancel = (e) => {
    e.preventDefault();

    this.props.history.push("/about");
  }

  handleSave = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSave();
  }

  doSave = async () => {
    try {
      const { _id, title, content } = this.state.data;
      await saveAbout({ _id, title, content });
      this.props.history.push("/about");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  render() {
    const pageTitle = { title: "About" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem"
    };
    const { data, errors } = this.state;
    const { title, content } = data;

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <form onSubmit={this.handleSave}>
                <div className="pb-4">
                  {this.renderButton("Cancel", "btn-secondary mr-2", this.handleCancel)}
                  {this.renderButton("Save", "btn-success ml-2 mr-2")}
                </div>
                {this.renderInput("title", "Title", title, this.handleChange, "text", errors)}
                {this.renderTextArea("content", "Content", "18", content, this.handleChange, errors)}
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AboutForm;