import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPreview } from '../../services/blogService';

class BlogPreview extends Component {
  state = { blogPreview: [] };

  async componentDidMount() {
    const blogPreview = await getBlogPreview();
    this.setState({ blogPreview });
  }

  render() {
    const { blogPreview } = this.state;
    const jumbotronStyle = { backgroundColor: "#f5f5f5", marginBottom: "0" };

    return (
      <React.Fragment>
        <div className="jumbotron jumbotron-fluid" style={jumbotronStyle}>
          <div className="container">

            <div className="row">
              <div className="col-xl">
                <h5 className="font-weight-bold"><i className="fa fa-th-large" aria-hidden="true"></i> Blog</h5>
              </div>
            </div>
            <div className="row">
              {blogPreview.map(blogPost =>
                <div key={blogPost._id} className="col-lg pb-4 d-flex align-items-stretch">
                  <div className="card shadow-sm rounded">
                    <Link to={"/blog/post/" + blogPost.slug}><img className="card-img-top" src={blogPost.img} alt="Card cap" /></Link>
                    <div className="card-body d-flex flex-column">
                      <p className="card-text">{blogPost.content.substring(0, 255).trim()}...</p>
                      <Link to={"/blog/post/" + blogPost.slug} className="mt-auto">Read More</Link>
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

export default BlogPreview;