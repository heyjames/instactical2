import React from 'react';

const Banner = () => {
  const jumbotronStyle = {
    backgroundColor: "#99392a",
    marginBottom: "0",
    padding: "2rem 1rem"
  };

  return (
    <div className="jumbotron jumbotron-fluid" style={jumbotronStyle}>
      <div className="container text-light">
        <h2 className="display-6">An Insurgency: Sandstorm Tactical Community</h2>
        <p className="lead">Less rushing. More co-op.</p>
      </div>
    </div>
  );
}

export default Banner;