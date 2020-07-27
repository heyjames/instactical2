import React from 'react';
import Banner from './banner';
import Form from './form';
import {
  getBlogPost,
  createBlogPost,
  saveBlogPost,
  deleteBlogPost
} from '../services/blogService';
import slugify from 'slugify';
import Container from './common/container';
import Row from './common/row';

class BlogPostForm extends Form {
  constructor(props) {
    super(props);

    this.state = {
      data: {
        _id: "",
        content: "",
        img: "/posts/no-img.png",
        featured: "0",
        slug: "",
        title: "",
        author: "James"
      },
      formState: "",
      errors: {}
    }
  }
  
  slugifyOptions = { replacement: '-', remove: /[*+~.()'"!:@]/g, lower: true };

  async componentDidMount() {
    await this.setFormState();
    
    const { formState } = this.state;
    if (formState === "edit") this.populateBlogPost();
  }

  setFormState = () => {
    const { path } = this.props.match;
    
    let result = path.substring(path.lastIndexOf('/') + 1);
    let { formState } = this.state;

    (result === "new") ? formState = "create" : formState = "edit";

    this.setState({ formState });
  }

  mapToViewModel = blogPost => {
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

  mapToObjectModel = blogPost => {
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
      const { slug } = this.props.match.params;
      const { data } = await getBlogPost(slug);

      this.setState({ data: this.mapToViewModel(data) });
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
      try {
        await deleteBlogPost(slug);
  
        this.props.history.push("/blog");
      } catch (ex) {
        console.log(ex.response);
      }
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
    const { formState, data } = this.state;
    const { history } = this.props;

    (formState === "create")
      ? history.push("/blog/post/")
      : history.push("/blog/post/" + slugify(data.slug, this.slugifyOptions));
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
          {this.renderButton("Cancel", "btn-sm btn-secondary mr-2 mt-3", this.handleCancel)}
          {this.renderButton("Create", "btn-sm btn-primary mr-2 mt-3", this.handleCreate)}
        </React.Fragment>
      )
    }

    if (formState === "edit") {
      return (
        <React.Fragment>
          {this.renderButton("Cancel", "btn-sm btn-secondary mr-2 mt-3", this.handleCancel)}
          {this.renderButton("Delete", "btn-sm btn-danger mt-3", () => this.handleDelete(slug))}
          {this.renderButton("Save", "btn-sm btn-success ml-2 mt-3", this.handleSave)}
        </React.Fragment>
      )
    }

  }

  initializePageStyles = () => {
    const pageStyles = {};

    pageStyles.bannerStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem",
      marginBottom: "0"
    };

    pageStyles.backgroundStyle = {
      backgroundColor: "#f5f5f5",
      marginBottom: "0",
      paddingTop: "1rem",
      paddingBottom: "1rem"
    };

    return pageStyles;
  }

  render() {
    const { params, path } = this.props.match;
    const { content, img, featured, title } = this.state.data;
    const { errors } = this.state;
    const { bannerStyle, backgroundStyle } = this.initializePageStyles();

    const result = path.substring(path.lastIndexOf('/') + 1);
    const titlePrefix = (result === "new") ? "Create " : "Edit ";
    const pageTitle = { title: titlePrefix + "Blog Post", subtitle: params.slug };
    const readOnlyOnEdit = (result === "new") ? null : false;
console.log("How many times do you see this?");
    return (
      <React.Fragment>
        <Banner info={pageTitle} style={bannerStyle} />
        <Container style={backgroundStyle}>
          <Row>
            {this.renderTextArea("content", "Content", content, this.handleChange, "12", errors, null, "mb-2")}
            {this.renderInput("img", "Image", img, this.handleChange, "text", errors, false, false, null, null, "mb-2")}
            {this.renderInput("featured", "Featured", featured, this.handleChange, "text", errors, false, false, null, null, "mb-2")}
            {this.renderInput("slug", "Slug", slugify(title, this.slugifyOptions), this.handleChange, "text", errors, true, false, null, null, "mb-2")}
            {this.renderInput("title", "Title", title, this.handleChange, "text", errors, readOnlyOnEdit)}
            {this.renderButtons()}
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default BlogPostForm;