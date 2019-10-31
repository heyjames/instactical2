import React from 'react';

const Banner = ({ info }) => {
  const jumbotronStyle = {
    backgroundColor: "#99392a",
    marginBottom: "0",
    padding: "2rem 1rem"
  };

  return (
    <div className="jumbotron jumbotron-fluid" style={jumbotronStyle}>
      <div className="container text-light">
        <h2 className="display-6">{info.title}</h2>
        <p className="lead">{info.subtitle}</p>
      </div>
    </div>
  );
}

export default Banner;