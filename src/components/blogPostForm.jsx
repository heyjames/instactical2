import React from 'react';
import Banner from './banner';
import Joi from 'joi-browser';
import Form from './form';
import Input from './input';
import TextArea from './textArea';
import { Link } from 'react-router-dom';
import {
  getBlogPost,
  createBlogPost,
  saveBlogPost
} from '../services/blogService';
import moment from 'moment';
let slugify = require('slugify');

class BlogPostForm extends Form {
  state = {
    data: { blogPost: { content: "", img: "", featured: "", label: "", slug: "", title: "" } },
    formState: "edit"
  }

  async componentDidMount() {
    const { match } = this.props;
    const slug = match.params.slug;

    let data = {};
    const blogPost = await getBlogPost(slug);
    data.blogPost = blogPost;
    this.setState({ data });
  }

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data.blogPost[input.name] = input.value;
    this.setState({ data });
  }

  renderTextArea = () => {
    return (
      <React.Fragment>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            autoFocus
            className="form-control"
            name="content"
            id="content"
            rows="4"
            onChange={this.handleChange}
            value={this.state.data.blogPost.content}
          >
          </textarea>
        </div>

        <div className="form-group">
          <label htmlFor="img">Image</label>
          <input
            autoFocus
            className="form-control"
            name="img"
            id="img"
            rows="4"
            onChange={this.handleChange}
            value={this.state.data.blogPost.img}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Featured</label>
          <input
            autoFocus
            className="form-control"
            name="featured"
            id="featured"
            rows="4"
            onChange={this.handleChange}
            value={this.state.data.blogPost.featured}
          />
        </div>

        <div className="form-group">
          <label htmlFor="label">Label</label>
          <input
            autoFocus
            className="form-control"
            name="label"
            id="label"
            rows="4"
            onChange={this.handleChange}
            value={this.state.data.blogPost.label}
          />
        </div>

        <div className="form-group">
          <label htmlFor="slug">Slug</label>
          <input
            autoFocus
            className="form-control"
            name="slug"
            id="slug"
            rows="4"
            readOnly
            value={this.state.data.blogPost.slug}
          />
        </div>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            autoFocus
            className="form-control"
            name="title"
            id="title"
            rows="4"
            onChange={(e) => this.handleTitleChange(e)}
            value={this.state.data.blogPost.title}
          />
        </div>
      </React.Fragment>
    )
  }

  handleTitleChange = (e) => {
    this.handleChange(e);
    let slug = slugify(e.currentTarget.value, { replacement: '-', remove: /[*+~.()'"!:@]/g, lower: true });
    this.state.data.blogPost.slug = slug;
  }

  handleCancel = () => {
    this.props.history.push("/blog/post/" + this.state.data.blogPost.slug);
  }

  handleSave = async () => {
    let obj = { ...this.state.data.blogPost };
    // console.log(obj);
    await saveBlogPost(obj);
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
            className="btn btn-success ml-2"
            onClick={() => this.handleSave()}>
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
            <div className="col-md-8 offset-md-2">
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