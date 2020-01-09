import React from 'react';
import Banner from './banner';
import Joi from 'joi-browser';
import Form from './form';
import Input from './input';
import TextArea from './textArea';
import { Link } from 'react-router-dom';
import {
  getBlogPost,
  createBlogPost
} from '../services/blogService';
import moment from 'moment';

class BlogPostForm extends Form {
  state = {
    data: { blogPost: {} },
    formState: "edit"
  }

  async componentDidMount() {
    const { match } = this.props;
    const slug = match.params.slug;

    let data = {};
    const blogPost = await getBlogPost(slug);
    data.blogPost = blogPost;
    this.setState({ data });
    console.log(this.state);
  }

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data }
    data.blogPost = input.value;
    this.setState({ data });
  }

  renderTextArea = () => {
    return (
      <div className="form-group">
        <label htmlFor="blogPost">Blog</label>
        <textarea
          autoFocus
          className="form-control"
          name="blogPost"
          id="blogPost"
          rows="4"
          onChange={this.handleChange}
          value={this.state.data.blogPost.content}
        >
        </textarea>
      </div>
    )
  }

  handleCancel = () => {
    this.props.history.push("/blog/");
  }

  renderBtns = () => {
    const { formState } = this.state;
    // const announcementId = this.props.match.params.id;

    if (formState === "create") {
      return (
        <React.Fragment>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.handleCancel()}>
            Cancel</button>
          <button
            className="btn btn-primary mr-2"
            onClick={() => this.handleCreate()}>
            Create</button>
        </React.Fragment>
      )
    }

    if (formState === "edit") {
      return (
        <React.Fragment>
          <button
            className="btn btn-secondary mr-2"
            onClick={() => this.handleCancel()}>
            Cancel</button>
          <button
            className="btn btn-danger">
            Delete</button>
          <button
            className="btn btn-success ml-2">
            Save</button>
        </React.Fragment>
      )
    }

  }

  render() {
    const { slug } = this.props.match.params;
    const pageTitle = { title: "Edit Blog Post", subtitle: slug };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem"
    };

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">
          <div className="row">
            <div className="col-md-4 offset-md-4">
              <form onSubmit={(e) => e.preventDefault()}>
                {this.renderTextArea()}
                {this.renderBtns()}
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BlogPostForm;