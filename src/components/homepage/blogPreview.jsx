import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Blog extends Component {
  render() {
    const { blogPosts } = this.props;
    const blogPostsPreview = blogPosts.slice(0, 3).reverse();
    const jumbotronStyle = { backgroundColor: "#f5f5f5", marginBottom: "0" };

    return (
      <React.Fragment>
        <div className="jumbotron jumbotron-fluid" style={jumbotronStyle}>
          <div className="container">


            <div className="row">
              <div className="col-xl">
                <h5>Blog</h5>
              </div>
            </div>
            <div className="row">
              {blogPostsPreview.map(blogPost =>
                <div key={blogPost._id} className="col-lg pb-4">
                  <div className="card">
                    <Link to={"/blog/post/" + blogPost.slug}><img className="card-img-top" src={blogPost.img} alt="Card cap" /></Link>
                    <div className="card-body">
                      <p className="card-text">{blogPost.content.substring(0, 255).trim()}...</p>
                      <Link to={"/blog/post/" + blogPost.slug}>Read More</Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-lg">
                <div className="card border-0" style={{ backgroundColor: "#f5f5f5" }}>
                  <div className="card-body">
                    <Link to="/blog"><h6 className="text-right">More Posts</h6></Link>
                  </div>
                </div>
              </div>
            </div>



          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Blog;