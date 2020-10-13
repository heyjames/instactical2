import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPreview } from '../../services/blogService';
import Container from '../common/container';
// import { pause } from '../common/utils';
import { renderLoadingIndicator } from '../common/loading';

class BlogPreview extends Component {
  state = {
    isLoadingBlogPreview: true,
    blogPreview: []
  };
  
  _isMounted = false;

  async componentDidMount() {
    this._isMounted = true;
    // await pause(0.5);
    const blogPreview = await getBlogPreview();
    const isLoadingBlogPreview = false;

    if (this._isMounted) {
      this.setState({ blogPreview, isLoadingBlogPreview });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getPageStyles = () => {
    const pageStyles = {};

    pageStyles.backgroundStyle = {
      backgroundColor: "#f5f5f5",
      marginBottom: "0"
    };

    return pageStyles;
  }

  renderBlogPreview = () => {
    const { blogPreview } = this.state;

    return (
      <React.Fragment>
        <div className="row">
          {blogPreview.map(blogPost =>
            <div key={blogPost._id} className="col-lg pb-4 d-flex align-items-stretch">
              <div className="card shadow-sm rounded">
                <Link to={"/blog/post/" + blogPost.slug}><img className="card-img-top" src={blogPost.img} alt="Card cap" /></Link>
                <div className="card-body d-flex flex-column">
                  <p className="card-text">{blogPost.content.substring(0, 255).trim()}...</p>
                  <Link to={"/blog/post/" + blogPost.slug} className="mt-auto">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-lg">
            <div className="card border-0" style={{ backgroundColor: "#f5f5f5" }}>
              <div className="card-body">
                <Link to="/blog">
                  <h6 className="text-right">More Posts</h6>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const { backgroundStyle } = this.getPageStyles();
    const { isLoadingBlogPreview } = this.state;

    return (
      <React.Fragment>
        <Container style={backgroundStyle}>

          <div className="row">
            <div className="col-xl">
              <h5 className="font-weight-bold">
                <i className="fa fa-th-large" aria-hidden="true"></i> Blog
              </h5>
            </div>
          </div>

          { (isLoadingBlogPreview)
            ? renderLoadingIndicator()
            : this.renderBlogPreview()
          }

        </Container>
      </React.Fragment>
    );
  }
}

export default BlogPreview;