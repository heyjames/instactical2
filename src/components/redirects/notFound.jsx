import React from 'react';
import Banner from '../navigation/banner';

const NotFound = () => {
  const pageTitle = { title: "Error" };
  const jumbotronStyle = {
    backgroundColor: "#99392A",
    padding: "2rem 1rem"
  };

  return (
    <React.Fragment>
      <Banner info={pageTitle} style={jumbotronStyle} />
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h1>404 Not Found</h1>
          </div>
        </div>
      </div>
    </React.Fragment>);
}

export default NotFound;