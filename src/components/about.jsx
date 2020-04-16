import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getAbout, saveAbout } from '../services/aboutService';
import parse from 'html-react-parser';
import Banner from './banner';

class About extends Component {
  state = { _id: "", title: "", content: "" };

  async componentDidMount() {
    try {
      const { data } = await getAbout();
      const { _id, title, content } = data[0];

      this.setState({ _id, title, content });
    } catch (ex) {
      // TODO: Insteaad of console.log(), pass it to the error handler
      console.log(ex.response.data);
    }
  }

  render() {
    const pageTitle = { title: "About" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem",
      marginBottom: "0"
    };
    const { user } = this.props;
    const { title, content } = this.state;

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "#f5f5f5", marginBottom: "0" }}>
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
                <h3>{title}</h3>
                <div>{parse(content)}</div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default About;