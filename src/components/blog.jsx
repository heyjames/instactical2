import React, { Component } from 'react';
import { getBlogPosts } from '../services/blogService';
import { Link } from 'react-router-dom';
import Banner from './banner';
import Pagination from './pagination';
import { paginate } from '../utils/paginate';

class Blog extends Component {
  state = {
    blogPosts: [],
    currentPage: 1,
    pageSize: 2
  }

  async componentDidMount() {
    let { data } = await getBlogPosts();
    data = data.sort((a, b) => (a._id < b._id) ? 1 : -1);

    this.setState({ blogPosts: data });
  }

  handlePageChange = (page) => { this.setState({ currentPage: page }); }

  render() {
    const pageTitle = { title: "Blog Posts" };
    const jumbotronStyle = {
      backgroundColor: "#212121",
      padding: "2rem 1rem"
    };
    const { blogPosts: allBlogPosts, currentPage, pageSize } = this.state;
    const { length: count } = this.state.blogPosts;
    const blogPosts = paginate(allBlogPosts, currentPage, pageSize);

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">

          <div className="row">
            <div className="col-md-4">
              <h4 className="text-muted"><u>Page {currentPage}</u></h4>
              {blogPosts.map(blogPost =>
                <div key={blogPost._id}>
                  <Link to={"/blog/post/" + blogPost.slug}>{blogPost.title}</Link>
                </div>
              )}
            </div>

            <div className="col-md-6">

              <div className="col-md-6 pb-4">
                <Link to={"/blog/new/"}>
                  <button
                    className="btn btn-sm btn-primary mr-2">
                    New</button>
                </Link>
              </div>

              {blogPosts.map(blogPost =>
                <div key={blogPost._id} className="col-lg pb-4">
                  <div className="card bg-light">
                    <Link to={"/blog/post/" + blogPost.slug}><img className="card-img-top" src={blogPost.img} alt="Card cap" /></Link>
                    <div className="card-body">
                      <h4 className="card-text font-weight-bold">{blogPost.title}</h4>
                      <p className="card-text">{blogPost.content.substring(0, 255).trim()}</p>
                      <Link to={"/blog/post/" + blogPost.slug}>Read More</Link>
                    </div>
                  </div>
                </div>
              )}
              <div className="col-md-6">
                <Pagination
                  itemsCount={count}
                  currentPage={this.state.currentPage}
                  pageSize={this.state.pageSize}
                  onPageChange={this.handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Blog;