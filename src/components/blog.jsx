import React from 'react';
import { getBlogPosts } from '../services/fakeBlogPosts';
import { Link } from 'react-router-dom'

const Blog = () => {
  const blogPostsPreview = getBlogPosts().reverse();
  const jumbotronStyle = {
    backgroundColor: "#99392a",
    padding: "2rem 1rem"
  };
  return (
    <div>
      <div className="jumbotron jumbotron-fluid" style={jumbotronStyle}>
        <div className="container text-light">
          <h2 className="display-6">Blog Posts</h2>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md">
            {blogPostsPreview.map(blogPost =>
              <div key={blogPost._id} className="col-lg pb-4">
                <div className="card">
                  <Link to={"/blog/post/" + blogPost.slug}><img className="card-img-top" src={blogPost.img} alt="Card cap" /></Link>
                  <div className="card-body">
                    <p className="card-text">{blogPost.content.substring(0, 255).trim()}</p>
                    <Link to={"/blog/post/" + blogPost.slug}>Read More</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;