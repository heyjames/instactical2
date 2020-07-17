import React, { Component } from 'react';
import Banner from './banner';
import { getBlogPost } from '../services/blogService';
import { Link } from 'react-router-dom';
import moment from 'moment';

class BlogPost extends Component {
  state = {
    blogPost: {}
  };

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

  render() {
    const { blogPost } = this.state;
    const { user } = this.props;
    const { slug } = this.props.match.params;

    const pageTitle = {
      title: blogPost.title,
      subtitle: `Posted ${moment(blogPost.createdAt, "YYYY-MM-DD hh:mm:ss Z").fromNow()}`,
      tag: moment(blogPost.createdAt).format("MMMM Do YYYY, h:mm:ss a")
    };

    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem",
      marginBottom: "0"
    };

    const backgroundStyle = {
      backgroundColor: "#f5f5f5",
      marginBottom: "0"
    };

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="jumbotron jumbotron-fluid" style={ backgroundStyle }>
          <div className="container">

            <div className="row pb-4">
              <div className="col-md-8 offset-md-2">
                <Link to={"/blog"}>
                  <button
                    className="btn btn-sm btn-secondary mr-2">
                    <i className="fa fa-chevron-left" aria-hidden="true"></i> Back to Posts</button>
                </Link>

                {user && <Link to={"/blog/post/" + slug + "/edit"}>
                  <button
                    className="btn btn-sm btn-primary mr-2">
                    <i className="fa fa-edit" aria-hidden="true"></i> Edit</button>
                </Link>}

              </div>
            </div>


            <div className="row">
              <div className="col-md-8 offset-md-2">
                <div className="card shadow-sm rounded">
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