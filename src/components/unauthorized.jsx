import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getAbout, saveAbout } from '../services/aboutService';
import parse from 'html-react-parser';
import Banner from './banner';

class Unauthorized extends Component {
  state = {};

  render() {
    const pageTitle = { title: "Unauthorized" };
    const jumbotronStyle = {
      backgroundColor: "#424242",
      padding: "2rem 1rem",
      marginBottom: "0"
    };

    return (
      <React.Fragment>
        <Banner info={pageTitle} style={jumbotronStyle} />
        <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "#f5f5f5", marginBottom: "0" }}>
          <div className="container">

            <div className="row">
              <div className="col-md-8 offset-md-2">
                <div>.</div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Unauthorized;