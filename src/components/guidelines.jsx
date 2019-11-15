import React from 'react';
import { getGuidelines } from '../services/fakeGuidelines';

const Guidelines = () => {
  const guidelines = getGuidelines().content;
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
            <p>{guidelines}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Guidelines;