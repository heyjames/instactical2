import React, { Component } from 'react';
import { getBlogPosts } from '../services/blogService';
import { Link } from 'react-router-dom';
import Banner from './banner';
import Pagination from './pagination';
import { paginate } from '../utils/paginate';
import { pause } from './common/utils';
import Container from './common/container';
import { renderLoadingIndicator } from './common/loading';

class Blog extends Component {
  state = {
    blogPosts: [],
    currentPage: 1,
    pageSize: 2,
    loading: true
  }
  
  _isMounted = false;

  async componentDidMount() {
    this._isMounted = true;
    document.title = "Blog - insTactical";
    
    this.populateBlog();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  populateBlog = async () => {
    try {
      await pause(0.4);
      const blogPosts = await getBlogPosts();
      const loading = false;
  
      if (this._isMounted) {
        this.setState({ blogPosts, loading });
      }
    } catch (error) {
      console.log(error.response);
    }
  }

  handlePageChange = page => this.setState({ currentPage: page });

  getPageStyles = () => {
    const pageStyles = {};

    pageStyles.bannerStyle = {
      backgroundColor: "#212121",
      padding: "2rem 1rem",
      marginBottom: "0"
    };

    pageStyles.backgroundStyle = {
      backgroundColor: "#f5f5f5",
      marginBottom: "0"
    };

    return pageStyles;
  }

  getBannerInfo = () => ({ title: "Blog Posts" });
  
  renderBlogPostCard = blogPosts => {
    return (
      <React.Fragment>
        {blogPosts.map(blogPost =>
          <div key={blogPost._id} className="col-lg pb-4">
            <div className="card shadow-sm rounded">
              <Link to={"/blog/post/" + blogPost.slug}>
                <img className="card-img-top" src={blogPost.img} alt="Card cap" />
              </Link>
              <div className="card-body">
                <h4 className="card-text font-weight-bold">
                  {blogPost.title}
                </h4>
                <p className="card-text">
                  {blogPost.content.substring(0, 255).trim()}
                </p>
                <Link to={"/blog/post/" + blogPost.slug}>
                  Read More
                </Link>
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }

  renderBlogPostsSummary = blogPosts => {
    return (
      <React.Fragment>
        {blogPosts.map(blogPost =>
          <div key={blogPost._id}>
            <Link to={"/blog/post/" + blogPost.slug}>
              {blogPost.title}
            </Link>
          </div>
        )}
      </React.Fragment>
    );
  }

  renderNewButtons = user => {
    return (
      <React.Fragment>
        {(user && user.isAdmin) && <div className="col-md-6 pb-4">
          <Link to={"/blog/new/"}>
            <button
              className="btn btn-sm btn-primary mr-2">
              <i className="fa fa-plus" aria-hidden="true"></i> New
            </button>
          </Link>
        </div>
        }
      </React.Fragment>
    );
  }
  
  render() {
    const { bannerStyle, backgroundStyle } = this.getPageStyles();
    const bannerInfo = this.getBannerInfo();
    const { blogPosts: allBlogPosts, currentPage, pageSize, loading } = this.state;
    const { length: count } = this.state.blogPosts;
    const blogPosts = paginate(allBlogPosts, currentPage, pageSize);
    const { user } = this.props;

    return (
      <React.Fragment>
        <Banner info={bannerInfo} style={bannerStyle} />
        <Container style={backgroundStyle}>
        {loading
          ? renderLoadingIndicator()
          : (<div className="row">
              <div className="col-md-4">
                <Pagination
                  itemsCount={count}
                  currentPage={currentPage}
                  pageSize={pageSize}
                  onPageChange={this.handlePageChange}
                />
                {this.renderBlogPostsSummary(blogPosts)}
              </div>

              <div className="col-md-6">
                {this.renderNewButtons(user)}
                {this.renderBlogPostCard(blogPosts)}
              </div>
            </div>
        )}
        </Container>
      </React.Fragment >
    );
  }
}

export default Blog;