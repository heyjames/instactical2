import React, { Component } from 'react';
import Banner from './banner';
import Joi from 'joi-browser';
import Form from './form';
import {
  getBlogPost,
  createBlogPost,
  saveBlogPost,
  deleteBlogPost
} from '../services/blogService';
import slugify from 'slugify';

class BlogPostForm extends Form {
  state = {
    data: { _id: "", content: "", img: "/posts/no-img.png", featured: "0", slug: "", title: "", author: "James" },
    formState: "",
    errors: {}
  }

  slugifyOptions = { replacement: '-', remove: /[*+~.()'"!:@]/g, lower: true };

  async componentDidMount() {
    await this.setFormState();

    if (this.state.formState === "edit") this.populateBlogPost();
  }

  setFormState = () => {
    const { path } = this.props.match;
    let result = path.substring(path.lastIndexOf('/') + 1);
    let formState = this.state.formState;
    (result === "new") ? formState = "create" : formState = "edit";

    this.setState({ formState });
  }

  mapToViewModel = (blogPost) => {
    return {
      _id: blogPost._id,
      content: blogPost.content,
      img: blogPost.img,
      featured: blogPost.featured,
      slug: slugify(blogPost.title, this.slugifyOptions),
      title: blogPost.title,
      author: blogPost.author
    };
  }

  mapToObjectModel = (blogPost) => {
    return {
      content: blogPost.content,
      img: blogPost.img,
      featured: blogPost.featured,
      slug: slugify(blogPost.title, this.slugifyOptions),
      title: blogPost.title,
      author: blogPost.author
    };
  }

  populateBlogPost = async () => {
    try {
      const slug = this.props.match.params.slug;
      const blogPost = await getBlogPost(slug);

      this.setState({ data: this.mapToViewModel(blogPost) });
    } catch (ex) {
      console.log(ex.response);
    }
  }

  handleCreate = async () => {
    try {
      await createBlogPost(this.mapToObjectModel(this.state.data));

      this.props.history.push("/blog");
    } catch (ex) {
      console.log(ex.response);
    }
  }

  handleDelete = async slug => {
    const confirmMsg = "Are you sure?";

    if (window.confirm(confirmMsg)) {
      await deleteBlogPost(slug);

      this.props.history.push("/blog");
    }
  }

  handleSave = async () => {
    try {
      await saveBlogPost(this.mapToViewModel(this.state.data));

      // this.props.history.replace("/blog/post/" + slugify(this.state.data.slug, this.slugifyOptions));
      this.props.history.replace("/blog");
    } catch (ex) {
      console.log(ex.response);
    }
  }

  handleCancel = () => {
    (this.state.formState === "create")
      ? this.props.history.push("/blog/post/")
      : this.props.history.push("/blog/post/" + slugify(this.state.data.slug, this.slugifyOptions));
  }

  handleChange = ({ currentTarget: input }) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data });
  }

  renderButtons = () => {
    const { formState } = this.state;
    const { slug } = this.props.match.params;

    if (formState === "create") {
      return (
        <React.Fragment>
          {this.renderButton("Cancel", "btn-secondary mr-2", this.handleCancel)}
          {this.renderButton("Create", "btn-primary mr-2", this.handleCreate)}
        </React.Fragment>
      )
    }

    if (formState === "edit") {
      return (
        <React.Fragment>
          {this.renderButton("Cancel", "btn-secondary mr-2", this.handleCancel)}
          {this.renderButton("Delete", "btn-danger", () => this.handleDelete(slug))}
          {this.renderButton("Save", "btn-success ml-2", this.handleSave)}
        </React.Fragment>
      )
    }

  }

  render() {
    const { params, path } = this.props.match;
    const { content, img, featured, title } = this.state.data;
    const { errors } = this.state;

    const result = path.substring(path.lastIndexOf('/') + 1);
    const titlePrefix = (result === "new") ? "Create " : "Edit ";
    const pageTitle = { title: titlePrefix + "Blog Post", subtitle: params.slug };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem"
    };
    const readOnlyOnEdit = (result === "new") ? null : false;

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">
          <div className="row">
            <div className="col-md-8 offset-md-2">
              <form onSubmit={(e) => e.preventDefault()}>
                {this.renderTextArea("content", "Content", content, this.handleChange, "12", errors)}
                {this.renderInput("img", "Image", img, this.handleChange, "text", errors)}
                {this.renderInput("featured", "Featured", featured, this.handleChange, "text", errors)}
                {this.renderInput("slug", "Slug", slugify(title, this.slugifyOptions), this.handleChange, "text", errors, true)}
                {this.renderInput("title", "Title", title, this.handleChange, "text", errors, readOnlyOnEdit)}
                {this.renderButtons()}
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BlogPostForm;