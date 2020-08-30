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
import { pause } from './common/utils';
import { renderLoadingIndicator, renderLoadingBannerInfo } from './common/loading';

class BlogPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      blogPost: {}
    };
  
    this._isMounted = false;
  }

  async componentDidMount() {
    const { slug } = this.props.match.params;
    document.title = "Blog - insTactical";
    this._isMounted = true;

    try {
      await pause(0.7);
      const { data } = await getBlogPost(slug);
      const loading = false;

      if (this._isMounted) {
        this.setState({ blogPost: data, loading });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
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

  createBannerInfo = blogPost => {
    return {
      title: blogPost.title,
      subtitle: `Posted ${moment(blogPost.createdAt, "YYYY-MM-DD hh:mm:ss Z").fromNow()}`,
      tag: moment(blogPost.createdAt).format("MMMM Do YYYY, h:mm:ss a")
    }
  }

  renderBannerInfo = blogPost => {
    const { loading } = this.state;

    if (loading) {
      return renderLoadingBannerInfo();
    } else {
      return this.createBannerInfo(blogPost);
    }
  }

  render() {
    const { blogPost, loading } = this.state;
    const { user } = this.props;
    const { slug } = this.props.match.params;
    const { bannerStyle, backgroundStyle } = this.initializePageStyles();
    const bannerInfo = this.renderBannerInfo(blogPost); 

    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>

          {(loading)
            ? renderLoadingIndicator()
            : (<React.Fragment>
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
              </React.Fragment>)
          }
            
        </Container>
      </React.Fragment>
    );
  }
}

export default BlogPost;