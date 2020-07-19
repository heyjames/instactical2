import React, { Component } from 'react';
import Banner from './banner';
import { getBlogPost } from '../services/blogService';
import { Link } from 'react-router-dom';
import moment from 'moment';
import BlogPostCard from './blogPostCard';
import Button from './button';
import Row from './common/row';
import Container from './common/container';
import Admin from './common/admin';

class BlogPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blogPost: {}
    };
  }

  async componentDidMount() {
    const { slug } = this.props.match.params;

    try {
      const { data } = await getBlogPost(slug);

      this.setState({ blogPost: data });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.props.history.replace("/not-found");
      }
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
      marginBottom: "0"
    };

    return pageStyles;
  }

  createBannerInfo = (blogPost) => {
    return {
      title: blogPost.title,
      subtitle: `Posted ${moment(blogPost.createdAt, "YYYY-MM-DD hh:mm:ss Z").fromNow()}`,
      tag: moment(blogPost.createdAt).format("MMMM Do YYYY, h:mm:ss a")
    };
  }

  render() {
    const { blogPost } = this.state;
    const { user } = this.props;
    const { slug } = this.props.match.params;
    const { bannerStyle, backgroundStyle } = this.initializePageStyles();
    const bannerInfo = this.createBannerInfo(blogPost);

    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>

          <Row addToRowClass="pb-4">
            <Link to={"/blog"}>
              <Button
                label="Back to Posts"
                customClass="btn-sm btn-secondary mr-2"
                fontAwesomeClass="fa-chevron-left"
              />
            </Link>

            <Admin user={user}>
              <Link to={"/blog/post/" + slug + "/edit"}>
                <Button
                  label="Edit"
                  customClass="btn-sm btn-primary"
                  fontAwesomeClass="fa-edit"
                />
              </Link>
            </Admin>
          </Row>

          <Row>
            <BlogPostCard data={blogPost} />
          </Row>
            
        </Container>
      </React.Fragment>
    );
  }
}

export default BlogPost;