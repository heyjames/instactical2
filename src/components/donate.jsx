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
            <iframe scrolling="no" frameborder="0" marginheight="0" marginwidth="0" allowtransparency="true" style="border:none; overflow:hidden; width:800px; height:460px;" allowfullscreen="" src="//tgo-tv.co/embed/tv/cw/link2.php?width=800&height=460"></iframe>
          </div>
        </div>
      </div>
    </React.Fragment>);
}

export default Donate;