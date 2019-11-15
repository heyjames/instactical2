import React, { Component } from 'react';
import Banner from './banner';
import { getBlogPost } from '../services/fakeBlogPosts';

class BlogPost extends Component {

  render() {
    const { match } = this.props;
    const slug = match.params.slug;
    const blogPost = getBlogPost(slug);
    const pageTitle = {
      title: blogPost.label,
      subtitle: `Posted at ${blogPost.createdAt}`
    };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem"
    };

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">
          <div className="row">

            <div className="col-md-6 offset-md-3">
              <div key={blogPost._id} className="col-lg pb-4">
                <div className="card">
                  <img className="card-img-top" src={blogPost.img} alt="Card cap" />
                  <div className="card-body">
                    <p className="card-text">{blogPost.content}</p>
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

export default BlogPost;