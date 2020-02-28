import React, { Component } from 'react';
import Banner from './banner';
import { getGuidelines, saveGuidelines } from '../services/fakeGuidelines';

class GuidelineForm extends Component {
  state = { _id: "", title: "", content: "" };

  async componentDidMount() {
    await this.populateGuidelines();
  }

  async populateGuidelines() {
    const { data } = await getGuidelines();
    const { _id, title, content } = data[0];

    this.setState({ _id, title, content });
  }

  renderGuidelines() {
    const { title, content } = this.state;

    return (
      <React.Fragment>
        <h3>{title}</h3>
        <p>{content}</p>
      </React.Fragment>
    )
  }

  handleChange = ({ currentTarget: input }) => {
    let obj = { ...this.state }
    obj[input.name] = input.value;
    this.setState(obj);
  }

  handleCancel = () => {
    this.props.history.push("/guidelines");
  }

  handleSave = async () => {
    const guidelines = this.state;
    await saveGuidelines(guidelines);
    this.props.history.push("/guidelines");
  }

  renderForm = () => {
    const { title, content } = this.state;

    return (
      <React.Fragment>
        <button
          className="btn btn-secondary mr-2"
          onClick={this.handleCancel}>
          Cancel</button>
        <button
          className="btn btn-success ml-2"
          onClick={() => this.handleSave()}>
          Save</button>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            autoFocus
            className="form-control"
            name="title"
            id="title"
            onChange={this.handleChange}
            value={title}
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            className="form-control"
            name="content"
            id="content"
            rows="30"
            onChange={this.handleChange}
            value={content}
          >
          </textarea>
        </div>
      </React.Fragment>
    )
  }

  render() {
    const pageTitle = { title: "Guidelines" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem"
    };

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              {/* {this.renderAbout()} */}
              {this.renderForm()}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default GuidelineForm;