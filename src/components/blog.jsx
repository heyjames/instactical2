import React from 'react';
import { getBlogPosts } from '../services/fakeBlogPosts';
import { Link } from 'react-router-dom';
import Banner from './banner';

const Blog = () => {
  const blogPosts = getBlogPosts();
  const pageTitle = { title: "Blog Posts" };
  const jumbotronStyle = {
    backgroundColor: "#212121",
    padding: "2rem 1rem"
  };

  return (
    <React.Fragment>
      <Banner info={pageTitle} style={jumbotronStyle} />
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            {blogPosts.map(blogPost => <div key={blogPost._id}>{blogPost.title}</div>)}
          </div>

          <div className="col-md-6">
            {blogPosts.map(blogPost =>
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
    </React.Fragment>
  );
}

export default Blog;