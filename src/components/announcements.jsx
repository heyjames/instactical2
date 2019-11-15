import React from 'react';
import Banner from './banner';

const Announcements = ({ announcements }) => {
  const pageTitle = { title: "Announcements" };
  const jumbotronStyle = {
    backgroundColor: "#424242",
    padding: "2rem 1rem"
  };
  return (
    <React.Fragment>
      <Banner info={pageTitle} style={jumbotronStyle} />
      <div className="container">
        <div className="row">
          <div className="col-md-4">


            <div className="card">
              <ul className="list-group list-group-flush">
                {announcements.map(announcement =>
                  <li key={announcement._id} className="list-group-item">
                    <div>{announcement.content}</div>
                  </li>
                )}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Announcements;