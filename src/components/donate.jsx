import React from 'react';
import Banner from './banner';

const Donate = () => {
  const pageTitle = { title: "Donate" };
  const jumbotronStyle = {
    backgroundColor: "#228B22",
    padding: "2rem 1rem"
  };
  return (
    <React.Fragment>
      <Banner info={pageTitle} style={jumbotronStyle} />
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            asds
          </div>
        </div>
      </div>
    </React.Fragment>);
}

export default Donate;