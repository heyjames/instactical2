import React from 'react';
import Banner from './banner';

const About = () => {
  const pageTitle = { title: "About" };
  const jumbotronStyle = {
    backgroundColor: "#424242",
    padding: "2rem 1rem"
  };
  return (
    <React.Fragment>
      <Banner info={pageTitle} style={jumbotronStyle} />
      <div className="container">
        <div className="row">
          <div className="col-md-4 offset-md-2">
            asds
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default About;