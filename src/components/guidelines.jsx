import React, { Component } from 'react';
import { getGuidelines } from '../services/fakeGuidelines';
import Banner from './banner';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';

class Guidelines extends Component {
  state = { _id: "", title: "", content: "" }

  async componentDidMount() {
    const { data } = await getGuidelines();
    const { _id, title, content } = data[0];

    this.setState({ _id, title, content });
  }

  render() {
    const jumbotronStyle = {
      backgroundColor: "#426397",
      padding: "2rem 1rem",
      marginBottom: "0"
    };
    const { user } = this.props;

    return (
      <React.Fragment>
        <div className="jumbotron jumbotron-fluid" style={jumbotronStyle}>
          <div className="container text-light">
            <h2 className="display-6">Guidelines</h2>
          </div>
        </div>
        <div className="jumbotron jumbotron-fluid" style={{ backgroundColor: "#f5f5f5", marginBottom: "0" }}>
          <div className="container">

            {user && <div className="row pb-4">
              <div className="col-md-8 offset-md-2">
                <Link to={"/guidelines/edit"}>
                  <button
                    className="btn btn-sm btn-primary mr-2">
                    Edit</button>
                </Link>
              </div>
            </div>}

            <div className="row">
              <div className="col-md-8 offset-md-2">
                <p>{this.state.title}</p>
                {parse(this.state.content)}
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Guidelines;