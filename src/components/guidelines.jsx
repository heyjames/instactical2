import React, { Component } from 'react';
import { getGuidelines } from '../services/fakeGuidelines';
import Banner from './banner';
import parse from 'html-react-parser';

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
      padding: "2rem 1rem"
    };

    return (
      <div>
        <div className="jumbotron jumbotron-fluid" style={jumbotronStyle}>
          <div className="container text-light">
            <h2 className="display-6">Guidelines</h2>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-xl">
              <p>{this.state.title}</p>
              {parse(this.state.content)}
            </div>
          </div>
        </div>
      </div>);
  }
}

export default Guidelines;