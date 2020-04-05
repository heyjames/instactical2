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
  saveBlogPost,
  deleteBlogPost
} from '../services/blogService';
import moment from 'moment';
let slugify = require('slugify');

class BlogPostForm extends Form {
  state = {
    data: { blogPost: { _id: "", content: "", img: "", featured: "0", label: "", slug: "", title: "", author: "James" } },
    formState: ""
  }

  async componentDidMount() {
    await this.setFormState();
    if (this.state.formState === "edit") this.populateBlogPost();
  }

  setFormState() {
    const { path } = this.props.match;
    let result = path.substring(path.lastIndexOf('/') + 1);
    let formState = this.state.formState;

    if (result === "new") {
      formState = "create";
    } else {
      formState = "edit";
    }

    return this.setState({ formState });
  }

  async populateBlogPost() {
    const slug = this.props.match.params.slug;
    let data = {};
    const blogPost = await getBlogPost(slug);
    data.blogPost = blogPost;
    delete blogPost.__v;
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

  handleDelete = async slug => {
    const confirmMsg = "Are you sure?";
    if (window.confirm(confirmMsg)) {
      await deleteBlogPost(slug);
      this.props.history.push("/blog");
    }
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
    try {
      let obj = { ...this.state.data.blogPost };
      // console.log(obj);
      await saveBlogPost(obj);
      this.props.history.push("/blog/post/" + this.state.data.blogPost.slug);
    } catch (ex) {
      console.log(ex.response);
    }
  }

  async handleCreate() {
    try {
      let obj = this.state.data.blogPost;
      delete obj._id;
      await createBlogPost(obj);
      this.props.history.push("/blog");
      // this.props.history.push("/blog/post/" + this.state.data.blogPost.slug);
    } catch (ex) {
      console.log(ex.response);
    }
  }

  renderBtns = () => {
    const { formState } = this.state;
    const { slug } = this.props.match.params;

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
            className="btn btn-danger"
            onClick={() => this.handleDelete(slug)}>
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
    // const { img, featured, label, slug: slug2, content, title } = this.state.data.blogPost;
    // console.log(img);
    // console.log(featured);
    // console.log(label);
    // console.log(slug2);
    // console.log(content);
    // console.log(title);

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