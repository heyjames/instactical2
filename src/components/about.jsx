import React, { Component } from 'react';
import Banner from './banner';
import { getAbout, saveAbout } from '../services/aboutService';
import { Link } from 'react-router-dom';
import parse from 'html-react-parser';

class About extends Component {
  state = { _id: "", title: "", content: "" };

  async componentDidMount() {
    await this.populateAbout();
  }

  async populateAbout() {
    const { data } = await getAbout();
    const { _id, title, content } = data[0];

    this.setState({ _id, title, content });
  }

  renderAbout() {
    const { title, content } = this.state;

    return (
      <React.Fragment>
        <h3>{title}</h3>
        <div>{parse(content)}</div>
      </React.Fragment>
    )
  }

  render() {
    const pageTitle = { title: "About" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem"
    };
    const { user } = this.props;

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="container">

          {user && (<div className="row pb-4">
            <div className="col-md-8 offset-md-2">
              <Link to={"/about/edit"}>
                <button
                  className="btn btn-sm btn-primary mr-2">
                  Edit</button>
              </Link>
            </div>
          </div>)}

          <div className="row">
            <div className="col-md-8 offset-md-2">
              {this.renderAbout()}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default About;