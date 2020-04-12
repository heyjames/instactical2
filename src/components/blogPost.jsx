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
    const { match } = this.props;
    const slug = match.params.slug;

    const data = await getBlogPost(slug);
    this.setState({ blogPost: data });
  }

  render() {
    const { blogPost } = this.state;
    const pageTitle = {
      title: blogPost.title,
      subtitle: `Posted ${moment(blogPost.createdAt, "YYYY-MM-DD hh:mm:ss Z").fromNow()}`,
      tag: moment(blogPost.createdAt).format("MMMM Do YYYY, h:mm:ss a")
    };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem"
    };
    const { user } = this.props;

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">

          {user && <div className="row pb-4">
            <div className="col-md-8 offset-md-2">
              <Link to={"/blog/post/" + this.props.match.params.slug + "/edit"}>
                <button
                  className="btn btn-sm btn-primary mr-2">
                  Edit</button>
              </Link>
            </div>
          </div>}


          <div className="row">
            <div className="col-md-8 offset-md-2">
              {/* <div key={blogPost._id} className="col-lg pb-4"> */}
              <div className="card">
                <img className="card-img-top" src={blogPost.img} alt="Card cap" />
                <div className="card-body">
                  <p className="card-text">{blogPost.content}</p>
                </div>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BlogPost;